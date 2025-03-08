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
    this.paymentForm = this.fb.group({
      amountToPay: [
        data.installment.amount, // Valor inicial: monto total de la cuota
        [Validators.required, Validators.max(data.installment.amount)], // Validación: no puede ser mayor que el monto total
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
      const totalAmount = this.data.installment.amount;
  
      // Verifica que los valores sean números válidos
      if (isNaN(this.data.installment.capitalAmount)) {
        console.error('capitalAmount no es un número válido');
        return;
      }
      if (isNaN(this.data.installment.interestAmount)) {
        console.error('interestAmount no es un número válido');
        return;
      }
  
      // Calcular el capital y el interés pagado
      const capitalPaid = (this.data.installment.capitalAmount / totalAmount) * amountToPay;
      const interestPaid = (this.data.installment.interestAmount / totalAmount) * amountToPay;
  
      const paymentData = {
        installmentId: this.data.installment.id, // ID de la cuota
        amount: amountToPay, // Monto a pagar
        paymentMethod: this.paymentForm.value.paymentMethod, // Método de pago
        paymentDate: this.paymentForm.value.paymentDate, // Fecha de pago
        capitalPaid: capitalPaid, // Capital pagado
        interestPaid: interestPaid, // Interés pagado
        totalPaid: amountToPay // Monto total pagado
      };
  
      // Llama al servicio para realizar el pago
      this.paymentService.payInstallment(paymentData).subscribe(
        (response) => {
          // Muestra un mensaje de éxito
          this.snackBar.open('Pago realizado con éxito', 'Cerrar', {
            duration: 3000,
          });
          this.dialogRef.close(response); // Cierra el modal y devuelve la respuesta
        },
        (error) => {
          // Muestra un mensaje de error
          this.snackBar.open('Error al realizar el pago', 'Cerrar', {
            duration: 3000,
          });
          console.error('Error al realizar el pago:', error);
        }
      );
    }
  }
}