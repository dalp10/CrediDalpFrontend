// payment-list.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PaymentService } from '../services/payment.service';
import { Client } from '../models/client.model';
import { Credit } from '../models/credit.model';
import { Installment } from '../models/installment.model';
import { PaymentModalComponent } from '../shared/modals/Payment-modal/payment-modal.component';
import { ConfirmationModalComponent } from '../shared/modals/confirmation-modal/confirmation-modal.component';
import { ResponseModalComponent } from '../shared/modals/response-modal/response-modal.component';
import { formatCurrency } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';  // Asegúrate de importar el servicio
import { CustomApiResponse } from '../models/custom-api-response.model';
import { InstallmentStatus } from '../enum/installment-status';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatRadioModule,
    MatDialogModule,
  ],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css'],
})
export class PaymentListComponent implements OnInit {
  searchQuery: string = '';
  searchType: 'client' | 'credit' = 'client';
  clients: Client[] = [];
  credits: Credit[] = [];
  selectedClient: Client | null = null;
  selectedCredit: Credit | null = null;
  installments: Installment[] = [];
  backendResponseReceived: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar  // Inyecta MatSnackBar en el constructor
  ) {}

  ngOnInit(): void {}

  search(): void {
    this.clients = [];
    this.credits = [];
    this.selectedClient = null;
    this.selectedCredit = null;
    this.installments = [];
    this.backendResponseReceived = false;
  
    if (this.searchType === 'client') {
      this.paymentService.searchClients(this.searchQuery).subscribe({
        next: (response: CustomApiResponse<Client[]>) => {
          this.backendResponseReceived = true;
          this.clients = response.data; // Accede a response.data
        },
        error: (error: any) => {
          console.error('Error al buscar clientes', error);
          this.backendResponseReceived = true;
          this.clients = [];
        },
      });
    } else {
      this.paymentService.searchCredits(this.searchQuery).subscribe({
        next: (response: CustomApiResponse<Credit[]>) => {
          this.backendResponseReceived = true;
          this.credits = response.data; // Accede a response.data
        },
        error: (error: any) => {
          console.error('Error al buscar créditos', error);
          this.backendResponseReceived = true;
          this.credits = [];
        },
      });
    }
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
    this.selectedCredit = null;
    this.installments = [];
    this.paymentService.getCreditsByClient(client.id!).subscribe({
      next: (response: CustomApiResponse<Credit[]>) => {
        this.credits = response.data; // Accede a response.data
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al cargar los créditos del cliente', error);
        this.credits = [];
        this.cdr.detectChanges();
      },
    });
  }

  selectCredit(credit: Credit): void {
    this.selectedCredit = credit;
    this.paymentService.getInstallmentsByCreditId(credit.id!).subscribe({
      next: (response: CustomApiResponse<Installment[]>) => {
        this.installments = response.data.sort(
          (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        console.log(this.installments);
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al cargar las cuotas del crédito', error);
        this.installments = [];
        this.cdr.detectChanges();
      },
    });
  }
  

  isOldestUnpaidInstallment(installment: Installment): boolean {
    const unpaidInstallments = this.installments.filter(
      (inst) => inst.status !== InstallmentStatus.PAGADA
    );
    if (unpaidInstallments.length === 0) {
      return false;
    }
    return installment.id === unpaidInstallments[0].id;
  }


  payInstallment(installment: Installment): void {
    console.log('Installment:', installment); // Depuración: Verifica los datos de la cuota
    if (!installment.creditId || !installment.id) {
      this.snackBar.open('El crédito o la cuota no tienen un ID válido', 'Cerrar', { duration: 3000 });
      return;
    }
  
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      data: { installment },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectCredit(this.selectedCredit!);
        this.dialog.open(ResponseModalComponent, {
          data: { message: 'Pago realizado con éxito.' },
        });
      }
    });
  }
  
}