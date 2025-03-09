import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { PaymentService } from '../services/payment.service';
import { Client } from '../models/client.model';
import { SinglePaymentModalComponent } from '../shared/modals/single-payment-modal/single-payment-modal.component';
import { ConfirmationModalComponent } from '../shared/modals/confirmation-modal/confirmation-modal.component';
import { ResponseModalComponent } from '../shared/modals/response-modal/response-modal.component';
import { Loan } from '../models/loan.model';

@Component({
  selector: 'app-single-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
  ],
  templateUrl: './single-payment.component.html',
  styleUrls: ['./single-payment.component.css'],
})
export class SinglePaymentComponent implements OnInit {
  searchQuery: string = ''; // Consulta de búsqueda
  clients: Client[] = []; // Lista de clientes encontrados
  loans: Loan[] = []; // Lista de créditos del cliente seleccionado
  selectedClient: Client | null = null; // Cliente seleccionado
  selectedLoan: Loan | null = null; // Crédito seleccionado
  backendResponseReceived: boolean = false; // Indica si se recibió respuesta del backend

  constructor(
    private paymentService: PaymentService, // Servicio para manejar pagos
    private dialog: MatDialog // Servicio para abrir modales
  ) {}

  ngOnInit(): void {
    // Inicialización de datos si es necesario
  }

  /**
   * Método para obtener la clase CSS correspondiente al estado del crédito.
   * @param status El estado del crédito.
   * @returns La clase CSS correspondiente.
   */
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'paid':
        return 'paid';
      case 'overdue':
        return 'overdue';
      case 'in-progress':
        return 'in-progress';
      default:
        return '';
    }
  }
  
  /**
   * Método para buscar clientes por nombre o documento.
   */
  search(): void {
    if (!this.searchQuery.trim()) {
      this.clients = [];
      this.backendResponseReceived = false;
      return;
    }

    this.resetState(); // Reiniciar el estado antes de una nueva búsqueda

    this.paymentService.searchClients(this.searchQuery).subscribe({
      next: (data) => {
        this.clients = data;
        this.backendResponseReceived = true;
      },
      error: (error) => {
        console.error('Error al buscar clientes:', error);
        this.clients = [];
        this.backendResponseReceived = true;
      },
    });
  }

  /**
   * Método para seleccionar un cliente y cargar sus créditos.
   * @param client El cliente seleccionado.
   */
  selectClient(client: Client): void {
    this.selectedClient = client;
    this.selectedLoan = null; // Reiniciar el crédito seleccionado
    this.loadClientLoans(client.id!);
  }

  /**
   * Método para cargar los créditos de un cliente.
   * @param clientId El ID del cliente.
   */
  loadClientLoans(clientId: number): void {
    this.paymentService.getLoansByClient(clientId).subscribe({
      next: (data) => {
        this.loans = data;
      },
      error: (error) => {
        console.error('Error al cargar los créditos:', error);
        this.loans = [];
      },
    });
  }

  /**
   * Método para seleccionar un crédito.
   * @param loan El crédito seleccionado.
   */
  selectCredit(loan: Loan): void {
    console.log(loan);
    this.selectedLoan = loan;
  }

  /**
   * Método para abrir el modal de pago y procesar el pago.
   */
  openPaymentModal(): void {
    if (!this.selectedLoan) return;
  
    console.log('Loan antes de abrir el modal', this.selectedLoan);
  
    const dialogRef = this.dialog.open(SinglePaymentModalComponent, {
      data: {
        ...this.selectedLoan,
        totalAmount: this.selectedLoan.totalAmount,   // 575
        interestAmount: this.selectedLoan.interestAmount, // 75
        interestPaid: this.selectedLoan.interestPaid, // 0
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmPayment(result);
      }
    });
  }
  
  
  
  
  

  /**
   * Método para confirmar el pago y procesarlo.
   * @param paymentData Los datos del pago.
   */
  confirmPayment(paymentData: any): void {
    const confirmDialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        message: `¿Estás seguro de pagar ${paymentData.totalPaid}?`,
      },
    });

    confirmDialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.processPayment(paymentData); // Procesar el pago
      }
    });
  }

  /**
   * Método para procesar el pago.
   * @param paymentData Los datos del pago.
   */
  processPayment(paymentData: any): void {
    this.paymentService.makePayment(this.selectedLoan!.id, paymentData).subscribe({
      next: (response) => {
        this.showResponseModal('Pago realizado con éxito.');
        this.resetState(); // Reiniciar el estado después de un pago exitoso
      },
      error: (error) => {
        this.showResponseModal('Error al realizar el pago.');
      },
    });
  }

  /**
   * Método para mostrar un modal de respuesta.
   * @param message El mensaje a mostrar.
   */
  showResponseModal(message: string): void {
    this.dialog.open(ResponseModalComponent, {
      data: { message },
    });
  }

  /**
   * Método para reiniciar el estado del componente.
   */
  resetState(): void {
    this.clients = [];
    this.loans = [];
    this.selectedClient = null;
    this.selectedLoan = null;
    this.backendResponseReceived = false;
  }
}