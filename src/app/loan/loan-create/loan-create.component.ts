import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Importa FormsModule para ngModel
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Importa NgbModal para modales
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service'; // Servicio para obtener clientes
import { Client } from '../../models/client.model'; // Modelo de Cliente
import { HttpErrorResponse } from '@angular/common/http';
import { ClientSearchModalComponent } from '../../shared/client-search-modal/client-search-modal.component';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog

@Component({
  selector: 'app-loan-create',
  templateUrl: './loan-create.component.html',
  styleUrls: ['./loan-create.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule], // Importa FormsModule para ngModel y CommonModule
})
export class LoanCreateComponent implements OnInit {
  loan = {
    amount: 0,
    interestRate: 0,
    issueDate: '',
    dueDate: '',
    client: null as Client | null, // Cambia clientId por client
    clientName: '', // Nuevo campo para mostrar el nombre del cliente seleccionado
  };

  responseMessage: string = ''; // Mensaje de respuesta para mostrar después del backend
  minDueDate: string = ''; // Fecha mínima para el campo de vencimiento

  @ViewChild('confirmationModal') confirmationModal!: TemplateRef<any>;
  @ViewChild('responseModal') responseModal!: TemplateRef<any>;

  constructor(
    private loanService: LoanService,
    private clientService: ClientService, // Inyección del servicio de clientes
    private router: Router,
    private modalService: NgbModal,
    private dialog: MatDialog // Inyecta MatDialog
  ) {}

  ngOnInit(): void {
    // Establecer la fecha de emisión por defecto como la fecha actual
    const today = new Date();
    this.loan.issueDate = today.toISOString().split('T')[0];

    // Establecer la fecha de vencimiento por defecto como un mes después de la fecha actual
    const dueDate = new Date(today);
    dueDate.setMonth(today.getMonth() + 1);
    this.loan.dueDate = dueDate.toISOString().split('T')[0];

    // Calcular la fecha mínima para el campo de vencimiento (un mes después de la fecha de emisión)
    this.minDueDate = dueDate.toISOString().split('T')[0];
  }

  // Función para abrir el modal de búsqueda de clientes
  openClientSearchModal() {
    const dialogRef = this.dialog.open(ClientSearchModalComponent, {
      width: '600px', // Ancho del modal
      data: {} // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe((selectedClientId: number) => {
      if (selectedClientId) {
        // Busca el cliente seleccionado por su ID
        this.clientService.getClientById(selectedClientId).subscribe((client) => {
          this.loan.client = client; // Asigna el cliente seleccionado
          this.loan.clientName = `${client.firstName} ${client.lastName}`; // Asigna el nombre completo
        });
      }
    });
  }

  // Función para abrir el modal de respuesta
  openResponseModal() {
    const modalRef = this.modalService.open(this.responseModal);
    modalRef.result.then(
      () => {
        this.router.navigate(['/list-loan']); // Redirige después de cerrar el modal
      },
      () => {
        this.router.navigate(['/list-loan']); // Redirige si el modal se descarta
      }
    );
  }

  // Función que maneja el envío del formulario
  onSubmit(): void {
    // Validaciones antes de enviar
    if (this.loan.client === null || this.loan.clientName === '') {
      alert('Por favor, selecciona un cliente.');
      return;
    }
    if (this.loan.amount <= 0) {
      alert('El monto del préstamo debe ser mayor que cero.');
      return;
    }
    if (this.loan.interestRate <= 0) {
      alert('La tasa de interés debe ser mayor que cero.');
      return;
    }
    if (!this.loan.issueDate || !this.loan.dueDate) {
      alert('Por favor, asegúrate de seleccionar las fechas correctamente.');
      return;
    }

    console.log('Objeto loan antes de enviar:', this.loan); // Verifica el objeto loan

    this.loanService.createLoan(this.loan).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response); // Verifica la respuesta
        this.responseMessage = response;
        this.openResponseModal();
      },
      (err: HttpErrorResponse) => {
        console.error('Error en la solicitud:', err); // Verifica el error
        this.responseMessage = err.error;
        this.openResponseModal();
      }
    );
  }

  // Función para abrir el modal de confirmación antes de enviar
  openConfirmationModal() {
    if (this.loan.client === null) {
      alert('Por favor, selecciona un cliente.');
      return;
    }

    const modalRef = this.modalService.open(this.confirmationModal);
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.onSubmit(); // Si el usuario confirma, enviamos el formulario
      }
    }).catch(() => {
      console.log('Modal de confirmación descartado');
    });
  }
}