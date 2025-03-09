import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-single-payment-modal',
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
    MatCardModule,
  ],
  templateUrl: './single-payment-modal.component.html',
  styleUrls: ['./single-payment-modal.component.css'],
})
export class SinglePaymentModalComponent {
  paymentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SinglePaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Se espera que 'data' contenga todos los campos de Loan (totalAmount, interestAmount, interestPaid, etc.)
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // Inicializamos el formulario, usando totalAmount como tope para el pago.
    this.paymentForm = this.fb.group({
      amountToPay: [
        0,
        [Validators.required, Validators.max(this.data.totalAmount)],
      ],
      paymentMethod: ['', Validators.required],
      paymentDate: [new Date(), Validators.required],
      interestPaid: [0], // Se calculará automáticamente
    });

    // Para depuración, mostramos los datos recibidos
    console.log('Datos recibidos en el modal:', this.data);

    // Actualiza el interés pagado cada vez que cambia el monto ingresado
    this.paymentForm.get('amountToPay')?.valueChanges.subscribe((value) => {
      this.calculateInterest(value);
    });
  }

  /**
   * Calcula el interés pagado basándose en el monto ingresado.
   * Se prioriza el pago del interés pendiente, calculado como:
   *   interestDue = interestAmount - (interestPaid ya registrado)
   * Si el monto ingresado es mayor o igual que el interés pendiente,
   * se paga el interés completo; de lo contrario, se paga lo ingresado.
   * @param amountToPay Monto que el usuario desea pagar.
   */
  calculateInterest(amountToPay: number): void {
    // Usa el campo remainingInterest en lugar de interestAmount - interestPaid
    const interestDue = Number(this.data.remainingInterest) || 0;
  
    if (amountToPay <= 0) {
      this.paymentForm.patchValue({ interestPaid: 0 }, { emitEvent: false });
      return;
    }
  
    // Si el usuario ingresa más que el interés pendiente, se paga solo el interés pendiente.
    // Lo que sobre va a capital
    const calculatedInterestPaid = amountToPay >= interestDue ? interestDue : amountToPay;
    this.paymentForm.patchValue({ interestPaid: calculatedInterestPaid }, { emitEvent: false });
  }
  

  /**
   * Valida que el monto ingresado no supere la deuda total.
   */
  validateAmount(): void {
    const amountToPay = this.paymentForm.get('amountToPay')?.value;
    if (amountToPay > this.data.totalAmount) {
      this.paymentForm.get('amountToPay')?.setErrors({ max: true });
    } else {
      this.paymentForm.get('amountToPay')?.setErrors(null);
    }
  }

  /**
   * Cierra el modal sin procesar el pago.
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Envía los datos del pago aplicando la siguiente lógica:
   * - Se paga primero el interés pendiente.
   * - El capital pagado es la diferencia entre el monto ingresado y el interés pagado.
   * - El total pagado es el monto ingresado.
   */
  onSubmit(): void {
    if (this.paymentForm.valid) {
      const amountToPay = this.paymentForm.value.amountToPay;
      const interestPaid = this.paymentForm.value.interestPaid;
      const capitalPaid = amountToPay - interestPaid;

      const paymentData = {
        installmentId: this.data.id,
        capitalPaid: capitalPaid,
        interestPaid: interestPaid,
        installmentNumber: 1,
        paymentMethod: this.paymentForm.value.paymentMethod,
        paymentDate: this.paymentForm.value.paymentDate.toISOString(),
        totalPaid: amountToPay,
      };
      this.dialogRef.close(paymentData);
    }
  }
}
