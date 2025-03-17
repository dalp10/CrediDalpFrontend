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
    console.log('creditDetails:', this.creditDetails); // Asegúrate de que los datos estén aquí
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Función para imprimir el contenido del modal
  onPrint(): void {
    // Crear una nueva ventana
    const printWindow = window.open('', '_blank');
  
    // Verificar si la ventana se abrió correctamente
    if (!printWindow) {
      alert('No se pudo abrir la ventana de impresión. Asegúrate de desbloquear las ventanas emergentes.');
      return;
    }
  
    // Crear el contenido HTML para la impresión
    const content = `
      <html>
        <head>
          <title>Calendario de Pagos del Crédito</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h2 {
              color: #3f51b5;
              text-align: center;
              margin-bottom: 20px;
            }
            .credit-details {
              margin-bottom: 20px;
              padding: 16px;
              background-color: #fafafa;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .detail-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .detail-label {
              font-weight: bold;
              color: #333;
            }
            .detail-value {
              color: #555;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
            }
            th, td {
              padding: 10px;
              border: 1px solid #ddd;
              text-align: left;
            }
            th {
              background-color: #3f51b5;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .credit-details, table {
                page-break-after: always;
              }
              table {
                box-shadow: none;
                border-radius: 0;
              }
            }
          </style>
        </head>
        <body>
          <h2>Calendario de Pagos del Crédito</h2>
          <div class="credit-details">
            <div class="detail-item">
              <span class="detail-label">Importe solicitado:</span>
              <span class="detail-value">${this.creditDetails.amount}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Cuota:</span>
              <span class="detail-value">${this.creditDetails.installmentAmount}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Duración total:</span>
              <span class="detail-value">${this.creditDetails.duration}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Fecha de solicitud:</span>
              <span class="detail-value">${this.creditDetails.requestDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Fecha de vencimiento:</span>
              <span class="detail-value">${this.creditDetails.dueDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Día de pago:</span>
              <span class="detail-value">${this.creditDetails.paymentDay}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tasa Efectiva Anual:</span>
              <span class="detail-value">${this.creditDetails.tea}</span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>N° Cuota</th>
                <th>Fecha de Vencimiento</th>
                <th>Monto</th>
                <th>Capital</th>
                <th>Interés</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${this.installments.map((installment, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${new Date(installment.dueDate).toLocaleDateString('es-PE')}</td>
                  <td>${installment.amount.toFixed(2)}</td>
                  <td>${installment.capitalAmount.toFixed(2)}</td>
                  <td>${installment.interestAmount.toFixed(2)}</td>
                  <td>${installment.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  
    // Escribir el contenido en la nueva ventana
    printWindow.document.write(content);
    printWindow.document.close();
  
    // Imprimir la ventana
    printWindow.print();
  }
}