import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Para mostrar mensajes de éxito/error
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Importa el módulo de SnackBar

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
    MatSnackBarModule, // Importa el módulo de SnackBar
  ],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css'],
})
export class PaymentModalComponent {
  paymentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibe la cuota
    private fb: FormBuilder,
    private paymentService: PaymentService, // Inyecta el servicio de pagos
    private snackBar: MatSnackBar // Inyecta el servicio de notificaciones
  ) {
    // Calcular el interés y capital pendiente
    const interestDue = Number(data.installment.interestAmount) - Number(data.installment.interestPaid);
    const capitalDue = Number(data.installment.capitalAmount) - Number(data.installment.capitalPaid);
    // Sumar ambos y redondear a dos decimales
    const totalDue = interestDue + capitalDue;
    const totalDueRounded = Number(totalDue.toFixed(2));
  
    this.paymentForm = this.fb.group({
      amountToPay: [
        totalDueRounded, // Valor inicial: monto pendiente redondeado
        [Validators.required, Validators.max(totalDueRounded)] // Validación: no puede ser mayor que el total pendiente redondeado
      ],
      paymentMethod: ['', Validators.required],
      paymentDate: [new Date(), Validators.required],
    });
  }
  
  

  // Validar el monto ingresado
  validateAmount(): void {
    const amountToPay = this.paymentForm.get('amountToPay')?.value;
    if (amountToPay > this.data.installment.amount) {
      this.paymentForm.get('amountToPay')?.setErrors({ max: true });
    } else {
      this.paymentForm.get('amountToPay')?.setErrors(null);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const amountToPay = this.paymentForm.value.amountToPay;
      // Se asume que la cuota (data.installment) tiene los siguientes campos:
      // interestAmount, interestPaid, capitalAmount, capitalPaid
      // O alternativamente, campos calculados: interestRemaining y capitalRemaining.
      // Si no se reciben, se calculan:
      const interestDue = this.data.installment.interestAmount - this.data.installment.interestPaid;
      const capitalDue = this.data.installment.capitalAmount - this.data.installment.capitalPaid;
      
      let interestToPay: number;
      let capitalToPay: number;
      
      // Primero, se paga el interés pendiente
      if (amountToPay <= interestDue) {
        interestToPay = amountToPay;
        capitalToPay = 0;
      } else {
        interestToPay = interestDue;
        capitalToPay = amountToPay - interestDue;
        // Si el pago excede el total pendiente (interés + capital), se puede limitar:
        const totalDue = interestDue + capitalDue;
        if (amountToPay > totalDue) {
          interestToPay = interestDue;
          capitalToPay = capitalDue;
        }
      }
      
      // Preparar el objeto de datos para enviar al backend
      const paymentData = {
        installmentId: this.data.installment.id, // ID de la cuota
        amount: amountToPay, // Monto ingresado
        paymentMethod: this.paymentForm.value.paymentMethod,
        paymentDate: this.paymentForm.value.paymentDate,
        capitalPaid: capitalToPay, // Capital que se abonará
        interestPaid: interestToPay, // Interés que se abonará
        totalPaid: amountToPay // Monto total pagado
      };
  
      this.paymentService.payInstallment(paymentData).subscribe(
        (response) => {
          this.snackBar.open('Pago realizado con éxito', 'Cerrar', {
            duration: 3000,
          });
          this.dialogRef.close(response);
        },
        (error) => {
          this.snackBar.open('Error al realizar el pago', 'Cerrar', {
            duration: 3000,
          });
          console.error('Error al realizar el pago:', error);
        }
      );
    }
  }
  
}