// single-payment.component.ts
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
import { CustomApiResponse } from '../models/custom-api-response.model';


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
  searchQuery: string = '';
  clients: Client[] = [];
  loans: Loan[] = [];
  selectedClient: Client | null = null;
  selectedLoan: Loan | null = null;
  backendResponseReceived: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  search(): void {
    if (!this.searchQuery.trim()) {
      this.clients = [];
      this.backendResponseReceived = false;
      return;
    }
  
    this.resetState();
    this.paymentService.searchClients(this.searchQuery).subscribe({
      next: (response: CustomApiResponse<Client[]>) => {
        this.clients = response.data; // Accede a response.data
        this.backendResponseReceived = true;
      },
      error: (error: any) => {
        console.error('Error al buscar clientes:', error);
        this.clients = [];
        this.backendResponseReceived = true;
      },
    });
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
    this.selectedLoan = null;
    this.loadClientLoans(client.id!);
  }

  loadClientLoans(clientId: number): void {
    this.paymentService.getLoansByClient(clientId).subscribe({
      next: (response: CustomApiResponse<Loan[]>) => {
        this.loans = response.data; // Accede a response.data
      },
      error: (error: any) => {
        console.error('Error al cargar los créditos:', error);
        this.loans = [];
      },
    });
  }

  selectCredit(loan: Loan): void {
    this.selectedLoan = loan;
  }

  openPaymentModal(): void {
    if (!this.selectedLoan) return;

    const dialogRef = this.dialog.open(SinglePaymentModalComponent, {
      data: {
        ...this.selectedLoan,
        totalAmount: this.selectedLoan.totalAmount,
        interestAmount: this.selectedLoan.interestAmount,
        interestPaid: this.selectedLoan.interestPaid,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmPayment(result);
      }
    });
  }

  confirmPayment(paymentData: any): void {
    const confirmDialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { message: `¿Estás seguro de pagar ${paymentData.totalPaid}?` },
    });

    confirmDialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.processPayment(paymentData);
      }
    });
  }

  processPayment(paymentData: any): void {
    this.paymentService.makeLoanPayment(this.selectedLoan!.id, paymentData).subscribe({
      next: (response: any) => {
        this.showResponseModal('Pago realizado con éxito.');
        this.resetState();
      },
      error: (error: any) => {
        this.showResponseModal('Error al realizar el pago.');
      },
    });
  }

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

  showResponseModal(message: string): void {
    this.dialog.open(ResponseModalComponent, { data: { message } });
  }

  resetState(): void {
    this.clients = [];
    this.loans = [];
    this.selectedClient = null;
    this.selectedLoan = null;
    this.backendResponseReceived = false;
  }
}