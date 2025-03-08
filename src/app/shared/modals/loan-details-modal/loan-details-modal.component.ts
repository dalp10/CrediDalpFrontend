import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loan-details-modal',
  templateUrl: './loan-details-modal.component.html',
  styleUrls: ['./loan-details-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
})
export class LoanDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<LoanDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Función para imprimir los detalles del préstamo
  printDetails(): void {
    const printContent = document.querySelector('.loan-details')?.innerHTML; // Obtener el contenido a imprimir
    if (printContent) {
      const originalContent = document.body.innerHTML; // Guardar el contenido original de la página
      document.body.innerHTML = printContent; // Reemplazar el contenido de la página con el contenido a imprimir
      window.print(); // Lanzar la impresión
      document.body.innerHTML = originalContent; // Restaurar el contenido original de la página
      window.location.reload(); // Recargar la página para restaurar la funcionalidad
    }
  }
}