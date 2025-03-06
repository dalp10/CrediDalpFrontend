import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { ClientService } from '../../services/client.service';
import { NgxPaginationModule } from 'ngx-pagination';

import * as XLSX from 'xlsx'; // Importa la biblioteca xlsx
import { jsPDF } from 'jspdf';

import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  standalone: true,
  styleUrls: ['./loan-list.component.css'],
  imports: [CommonModule, RouterModule, FormsModule,NgxPaginationModule], // Agrega FormsModule aquí
})
export class LoanListComponent implements OnInit {
  loans: any[] = []; // Lista completa de préstamos
  filteredLoans: any[] = []; // Lista filtrada de préstamos
  searchText: string = ''; // Texto de búsqueda
  selectedLoan: any = null;
  responseMessage: string = ''; // Variable para almacenar el mensaje de respuesta
  // Modal de confirmación
  loanToDelete: any = null; // Guardar el préstamo a eliminar

  // Paginación
  page: number = 1;  // Página actual
  pageSize: number = 5;  // Elementos por página

  constructor(private loanService: LoanService,private clientService: ClientService) {}

  ngOnInit(): void {
    this.loanService.getLoans().subscribe(
      (loans: any[]) => {
        console.log('Préstamos recibidos del backend:', loans);
        this.clientService.getAllClients().subscribe(
          (clients: any[]) => {
            console.log('Clientes recibidos del backend:', clients);
            // Combinar préstamos con clientes
            this.loans = loans.map((loan) => ({
              ...loan,
              client: clients.find((client) => client.id === loan.clientId) || {
                firstName: 'Sin cliente',
                lastName: '',
              },
            }));
            this.filteredLoans = this.loans;
          },
          (error) => {
            console.error('Error al obtener los clientes:', error);
            alert('Error al cargar los clientes');
          }
        );
      },
      (error) => {
        console.error('Error al obtener los préstamos:', error);
        alert('Error al cargar los préstamos');
      }
    );
  }


// Función para abrir los detalles del préstamo en el modal
openLoanDetails(loan: any): void {
  this.selectedLoan = loan;

  // Obtener el elemento del modal
  const modalElement = document.getElementById('loanDetailsModal');

  // Verificar si el modalElement es null antes de usarlo
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  } else {
    console.error('Modal no encontrado');
  }
}


  // Aplicar filtro de búsqueda
  applyFilter(): void {
    this.filteredLoans = this.loans.filter((loan) =>
      `${loan.client.firstName} ${loan.client.lastName}`
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  deleteLoan(loanId: number): void {
    if (loanId) {
      // Guardar el ID del préstamo a eliminar
      this.loanToDelete = loanId;
  
      // Mostrar el modal de confirmación
      const modalElement = document.getElementById('deleteConfirmationModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      } else {
        console.error('Modal de confirmación no encontrado');
      }
    } else {
      console.error('ID del préstamo no válido:', loanId);
    }
  }
  
  // Exportar a Excel
  exportToExcel(): void {
    const data = this.filteredLoans.map((loan) => ({
      ID: loan.id,
      Cliente: `${loan.client.firstName} ${loan.client.lastName}`,
      Monto: loan.amount,
      'Tasa de Interés': loan.interestRate,
      Estado: loan.status,
      'Código': loan.loanCode,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Préstamos');

    // Guardar el archivo
    XLSX.writeFile(wb, 'prestamos.xlsx');
  }

  
  exportToPDF(): void {
    if (!this.selectedLoan) {
      alert('No hay detalles para exportar');
      return;
    }
  
    const doc = new jsPDF();
  
    // Configuración inicial
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 10;
    let yPosition = margin;
  
    // Encabezado
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalles del Préstamo', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += lineHeight + 10;
  
    // Línea decorativa
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
  
    // Información del préstamo
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
  
    // Sección 1: Información básica
    doc.text(`ID del Préstamo: ${this.selectedLoan.id}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Cliente: ${this.selectedLoan.client.firstName} ${this.selectedLoan.client.lastName}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Monto: ${this.selectedLoan.amount.toFixed(2)}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Tasa de Interés: ${this.selectedLoan.interestRate}%`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Monto de Interés: ${this.calculateInterest(this.selectedLoan).toFixed(2)}`, margin, yPosition);
    yPosition += lineHeight + 10;
  
    // Sección 2: Fechas y código
    doc.text(`Fecha de Emisión: ${this.selectedLoan.issueDate}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Fecha de Vencimiento: ${this.selectedLoan.dueDate}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Código del Préstamo: ${this.selectedLoan.loanCode}`, margin, yPosition);
    yPosition += lineHeight + 10;
  
    // Sección 3: Estado del préstamo y Monto Total
    doc.setFont('helvetica', 'bold');
    doc.text(`Estado del Préstamo:`, margin, yPosition);
    
    // Color del estado según el estado del préstamo
    if (this.selectedLoan.status === 'APPROVED') {
      doc.setTextColor(40, 167, 69); // Verde
    } else if (this.selectedLoan.status === 'PENDING') {
      doc.setTextColor(255, 193, 7); // Amarillo
    } else if (this.selectedLoan.status === 'REJECTED') {
      doc.setTextColor(220, 53, 69); // Rojo
    }
    
    // Escribir el estado en la misma línea
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.selectedLoan.status}`, margin + 70, yPosition); // Ajusta el margen izquierdo (70) según sea necesario
    doc.setTextColor(60, 60, 60); // Restaurar color
    yPosition += lineHeight;
  
    // Monto Total
    doc.setFont('helvetica', 'bold');
    doc.text(`Monto Total:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.calculateTotalAmount(this.selectedLoan).toFixed(2)}`, margin + 50, yPosition);
    yPosition += lineHeight + 15;
  
    // Línea decorativa
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
  
    // Notas adicionales
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Notas adicionales:', margin, yPosition);
    yPosition += lineHeight;
    doc.setFontSize(10);
    doc.text('Este es un resumen del préstamo. El cliente debe cumplir con el pago en la fecha de vencimiento.', margin, yPosition);
    yPosition += lineHeight;
    doc.text('Si no se paga a tiempo, pueden aplicarse cargos adicionales. Para más detalles, contactar con el soporte.', margin, yPosition);
    yPosition += lineHeight + 10;
  
    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Este documento es generado automáticamente y no requiere firma.', margin, 285);
  
    // Guardar el archivo PDF
    doc.save('detalles_prestamo.pdf');
  }
  
  showResponseModal(): void {
    const modalElement = document.getElementById('responseModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal de respuesta no encontrado');
    }
  }
  hideConfirmationModal(): void {
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        console.error('No se pudo obtener la instancia del modal de confirmación');
      }
    } else {
      console.error('Elemento del modal de confirmación no encontrado');
    }
  }
  
  // Confirmar y ejecutar la eliminación
  confirmDelete(): void {
    if (this.loanToDelete) {
      this.loanService.deleteLoan(this.loanToDelete).subscribe(
        (response) => {
          // Ocultar el modal de confirmación
          this.hideConfirmationModal();
  
          // Mensaje de éxito
          this.responseMessage = 'Préstamo eliminado con éxito';
          this.showResponseModal();
  
          // Actualizar la lista de préstamos
          this.loans = this.loans.filter((loan) => loan.id !== this.loanToDelete);
          this.applyFilter();
        },
        (error) => {
          // Ocultar el modal de confirmación
          this.hideConfirmationModal();
  
          // Mensaje de error
          this.responseMessage = 'Error al eliminar el préstamo: ' + error.message;
          this.showResponseModal();
        }
      );
    }
  }
// Función para calcular el monto de interés
calculateInterest(loan: any): number {
  if (!loan || !loan.amount || !loan.interestRate) return 0;
  return (loan.amount * loan.interestRate) / 100;
}

// Función para calcular el monto total (monto + interés)
calculateTotalAmount(loan: any): number {
  if (!loan || !loan.amount) return 0;
  return loan.amount + this.calculateInterest(loan);
}
}