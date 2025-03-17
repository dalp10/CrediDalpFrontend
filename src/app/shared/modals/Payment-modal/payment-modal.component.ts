// payment-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentCreditDTO } from '../../../DTO/payment-credit-dto.model';
import { Installment } from '../../../models/installment.model';
import { CustomApiResponse } from '../../../models/custom-api-response.model';


@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css'],
})
export class PaymentModalComponent {
  paymentForm: FormGroup = new FormGroup({});


  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {
    // Verificación de los datos antes de proceder
    if (!this.data.installment.creditId || !this.data.installment.id) {
      this.snackBar.open('El crédito o la cuota no tienen un ID válido', 'Cerrar', { duration: 3000 });
      this.dialogRef.close();  // Cierra el modal si los IDs no son válidos
      return;
    }
  
    const interestDue = Number(data.installment.interestAmount) - Number(data.installment.interestPaid);
    const capitalDue = Number(data.installment.capitalAmount) - Number(data.installment.capitalPaid);
    const totalDue = interestDue + capitalDue;
    const totalDueRounded = Number(totalDue.toFixed(2));
  
    this.paymentForm = this.fb.group({
      amountToPay: [
        totalDueRounded,
        [Validators.required, Validators.min(0.01), Validators.max(totalDueRounded)]
      ],
      paymentMethod: ['', Validators.required],
      paymentDate: [new Date(), Validators.required],
    });       
  }
  

  validateAmount(): void {
    const control = this.paymentForm.get('amountToPay');
    if (control) {
      const amountToPay = Number(control.value);
      const maxAllowed = Number(this.data.installment.amount);
      const errors: any = {};
  
      // Valida que el monto sea mayor a 0
      if (amountToPay < 0.01) {
        errors.min = true;
      }
      // Valida que el monto no exceda el máximo permitido
      if (amountToPay > maxAllowed) {
        errors.max = true;
      }
      
      control.setErrors(Object.keys(errors).length ? errors : null);
    }
  }
  

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const amountToPay = this.paymentForm.value.amountToPay;
      const interestDue = this.data.installment.interestAmount - this.data.installment.interestPaid;
      const capitalDue = this.data.installment.capitalAmount - this.data.installment.capitalPaid;
  
      let interestToPay: number;
      let capitalToPay: number;
  
      if (amountToPay <= interestDue) {
        interestToPay = amountToPay;
        capitalToPay = 0;
      } else {
        interestToPay = interestDue;
        capitalToPay = amountToPay - interestDue;
        const totalDue = interestDue + capitalDue;
        if (amountToPay > totalDue) {
          interestToPay = interestDue;
          capitalToPay = capitalDue;
        }
      }
  
      // Crear el objeto PaymentCreditDTO con la estructura que funciona
      const paymentData: PaymentCreditDTO = {
        creditId: this.data.installment.creditId, // Asegúrate de que creditId esté correctamente asignado
        installmentId: this.data.installment.id,  // Asegúrate de que installmentId esté correctamente asignado
        installmentNumber: this.data.installment.installmentNumber, // Este campo es obligatorio
        totalPaid: amountToPay, // Monto total pagado
        paymentDate: this.paymentForm.value.paymentDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        paymentMethod: this.paymentForm.value.paymentMethod, // Método de pago
        capitalPaid: capitalToPay, // Opcional, dependiendo de lo que el backend espere
        interestPaid: interestToPay, // Opcional, dependiendo de lo que el backend espere
      };
  
      // Enviar el pago al backend
      this.paymentService.payInstallment(this.data.installment.id, paymentData).subscribe({
        next: (response: CustomApiResponse<Installment>) => {
          this.snackBar.open('Pago realizado con éxito', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(response.data); // Accede a response.data
        },
        error: (error: any) => {
          this.snackBar.open('Error al realizar el pago', 'Cerrar', { duration: 3000 });
          console.error('Error al realizar el pago:', error);
        }
      });
    }
  }
}
