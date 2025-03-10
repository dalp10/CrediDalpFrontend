import { Component, OnInit } from '@angular/core';
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
import { formatCurrency } from '@angular/common'; // Importa formatCurrency
import { ChangeDetectorRef } from '@angular/core'; // Importa ChangeDetectorRef

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
  searchType: 'client' | 'credit' = 'client'; // Tipo de búsqueda (cliente o crédito)
  clients: Client[] = [];
  credits: Credit[] = [];
  selectedClient: Client | null = null;
  selectedCredit: Credit | null = null;
  installments: Installment[] = [];
  backendResponseReceived: boolean = false;  // Variable para controlar si se recibió la respuesta

  // Inyecta ChangeDetectorRef en el constructor
  constructor(
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef // Inyecta ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  // Buscar clientes o créditos
  search(): void {
    // Limpiar los resultados previos y el estado de la respuesta
    this.clients = [];
    this.credits = [];
    this.selectedClient = null;
    this.selectedCredit = null;
    this.installments = [];
    this.backendResponseReceived = false;  // Resetear la respuesta del backend

    // Realizar la búsqueda según el tipo (cliente o crédito)
    if (this.searchType === 'client') {
      this.paymentService.searchClients(this.searchQuery).subscribe(
        (data) => {
          this.backendResponseReceived = true;  // Marcar que la respuesta fue recibida
          if (data.length > 0) {
            this.clients = data;
          } else {
            this.clients = [];  // Asegurar que el array esté vacío si no hay resultados
          }
        },
        (error) => {
          console.error("Error al buscar clientes", error);
          this.backendResponseReceived = true;  // Marcar que la respuesta fue recibida
          this.clients = [];  // Asegurarse de que el array esté vacío en caso de error
        }
      );
    } else {
      this.paymentService.searchCredits(this.searchQuery).subscribe(
        (data) => {
          this.backendResponseReceived = true;  // Marcar que la respuesta fue recibida
          if (data.length > 0) {
            this.credits = data;
          } else {
            this.credits = [];  // Asegurar que el array esté vacío si no hay resultados
          }
        },
        (error) => {
          console.error("Error al buscar créditos", error);
          this.backendResponseReceived = true;  // Marcar que la respuesta fue recibida
          this.credits = [];  // Asegurarse de que el array esté vacío en caso de error
        }
      );
    }
  }
  
  // Función para manejar el mensaje de no resultados
showNoResultsMessage(type: 'client' | 'credit'): void {
  if (type === 'client') {
    this.clients = []; // Asegura que los clientes estén vacíos
  } else if (type === 'credit') {
    this.credits = []; // Asegura que los créditos estén vacíos
  }
}

  // Método para seleccionar un cliente
  selectClient(client: Client): void {
    this.selectedClient = client;
    this.selectedCredit = null;
    this.installments = [];
    this.paymentService.getCreditsByClient(client.id!).subscribe((data) => {
      console.log(data); // Verifica los datos recibidos
      this.credits = data;
      console.log(this.credits); // Verifica los datos recibidos
      this.cdr.detectChanges(); // Forzar la detección de cambios
    });
  }


  // Seleccionar un crédito
  selectCredit(credit: Credit): void {
    this.selectedCredit = credit;
    this.paymentService.getInstallmentsByCredit(credit.id!).subscribe((data) => {
      // Para mostrar todas las cuotas, sin filtrar por estado:
      this.installments = data.sort((a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      
      // Si prefieres filtrar pero incluir PAID, podrías hacer:
      // this.installments = data.filter(installment =>
      //   installment.status === 'PENDING' ||
      //   installment.status === 'OVERDUE' ||
      //   installment.status === 'PARTIALLY_PAID' ||
      //   installment.status === 'PAID'
      // ).sort((a, b) =>
      //   new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      // );
      
      console.log("Cuotas actualizadas:", this.installments);
      this.cdr.detectChanges();
    });
  }
  
  
  // Método para verificar si una cuota es la más antigua
  isOldestUnpaidInstallment(installment: Installment): boolean {
    // Filtrar solo las cuotas que aún no están pagadas
    const unpaidInstallments = this.installments.filter(inst => inst.status !== 'PAID');
    
    // Si no hay cuotas pendientes, se retorna false
    if (unpaidInstallments.length === 0) {
      return false;
    }
    
    // Asumiendo que 'this.installments' ya está ordenada por fecha de vencimiento,
    // la cuota pendiente más antigua será la primera en 'unpaidInstallments'
    return installment.id === unpaidInstallments[0].id;
  }
  
  
  

    // Realizar un pago
    payInstallment(installment: Installment): void {
      const dialogRef = this.dialog.open(PaymentModalComponent, {
        data: { installment },
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // Solo actualiza la lista de cuotas y muestra el mensaje de respuesta
          this.selectCredit(this.selectedCredit!);
          this.dialog.open(ResponseModalComponent, {
            data: { message: 'Pago realizado con éxito.' },
          });
        }
      });
    }
    
  
}
