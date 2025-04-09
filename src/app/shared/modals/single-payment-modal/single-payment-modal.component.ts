// single-payment-modal.component.ts
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
    @Inject(MAT_DIALOG_DATA) public data: any, // Se espera que 'data' contenga: installmentNumber y totalAmount
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.paymentForm = this.fb.group({
      amountToPay: [
        null,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(this.data.totalAmount),
        ],
      ],      
      paymentMethod: ['', Validators.required],
      paymentDate: [new Date(), Validators.required],
      interestPaid: [0],
    });

    console.log('Datos recibidos en el modal:', this.data);

    // Actualiza el interés pagado cada vez que cambia el monto ingresado
    this.paymentForm.get('amountToPay')?.valueChanges.subscribe((value) => {
      this.calculateInterest(value);
    });
  }

  calculateInterest(amountToPay: number): void {
    const interestDue = Number(this.data.remainingInterest) || 0;
  
    if (amountToPay <= 0) {
      this.paymentForm.patchValue({ interestPaid: 0 }, { emitEvent: false });
      return;
    }
  
    const calculatedInterestPaid = amountToPay >= interestDue ? interestDue : amountToPay;
    this.paymentForm.patchValue({ interestPaid: calculatedInterestPaid }, { emitEvent: false });
  }
  
  validateAmount(): void {
    const amountToPay = this.paymentForm.get('amountToPay')?.value;
    if (amountToPay > this.data.totalAmount) {
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
      const interestPaid = this.paymentForm.value.interestPaid;
      const capitalPaid = amountToPay - interestPaid;

      const paymentData = {
        installmentId: this.data.id,
        installmentNumber: this.data.installmentNumber, // Asegúrate de enviar installmentNumber
        paymentMethod: this.paymentForm.value.paymentMethod,
        paymentDate: this.paymentForm.value.paymentDate.toISOString(),
        capitalPaid: capitalPaid,
        interestPaid: interestPaid,
        totalPaid: amountToPay,
      };
      
      this.dialogRef.close(paymentData);
    }
  }
}
