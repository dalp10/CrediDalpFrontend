import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Installment } from '../../models/installment.model';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-payment-schedule-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './payment-schedule-modal.component.html',
  styleUrls: ['./payment-schedule-modal.component.css']
})
export class PaymentScheduleModalComponent {
  displayedColumns: string[] = ['installmentNumber', 'dueDate', 'amount', 'capitalAmount', 'interestAmount', 'status'];
  installments: Installment[] = [];
  creditDetails: any;

  constructor(
    public dialogRef: MatDialogRef<PaymentScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { installments: Installment[], creditDetails: any }
  ) {
    this.installments = data.installments;
    this.creditDetails = data.creditDetails;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}