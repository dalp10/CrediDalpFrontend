import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GroupPaymentDTO } from '../../DTO/group-payment-dto.model';
import { GroupPaymentContributionDTO } from '../../DTO/group-payment-contribution-dto.model';
import { GroupPaymentService } from '../../services/group-payment.service';
import { ClientService } from '../../services/client.service'; // Importa el servicio de clientes
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PaymentMethod } from '../../models/PaymentMethod.model';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ClientSearchModalComponent } from '../../shared/client-search-modal/client-search-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfirmationModalComponent } from '../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ResponseModalComponent } from '../../shared/modals/response-modal/response-modal.component';
import { MatDialogModule } from '@angular/material/dialog'; // Agrega esta línea
import { switchMap } from 'rxjs/operators';
import { CustomApiResponse } from '../../models/custom-api-response.model';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Client } from '../../models/client.model';


@Component({
  selector: 'app-group-payment-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule, // Agrega esto
    MatNativeDateModule,  // Agrega esto
    MatDialogModule, // Agrega esta línea
  ],
  templateUrl: './group-payment-detail.component.html',
  styleUrls: ['./group-payment-detail.component.css']
})
export class GroupPaymentDetailComponent implements OnInit {
  payment: GroupPaymentDTO | null = null;        // Aquí se guardará el pago grupal
  newContributionForm: FormGroup;                // Form para agregar una contribución
  paymentMethods = Object.values(PaymentMethod); // Para desplegar en <mat-select>
  responseMessage: string = ''; // <-- Agregar esta línea

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private groupPaymentService: GroupPaymentService,
    private clientService: ClientService, // Inyecta el servicio de clientes
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.newContributionForm = this.fb.group({
      clientId: [null, Validators.required], // Campo obligatorio
      clientName: [{ value: '', disabled: true }],
      amountPaid: [0, [Validators.required, Validators.min(1)]], // Campo obligatorio y mínimo de 1
      contributionDate: [new Date(), Validators.required], // Campo obligatorio
      paymentMethod: ['', Validators.required], // Campo obligatorio
    });
  }

  ngOnInit(): void {
    // Obtener el ID de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const paymentId = +id;
      this.loadGroupPayment(paymentId);
    }
  }

    // Método para cerrar el modal
    onClose(): void {
      this.dialog.closeAll(); // Cierra todos los modales abiertos
    }
    
  // Agrega esta propiedad para almacenar los nombres de los clientes
clientNames: { [key: number]: string } = {};

// Función para obtener el nombre del cliente
getClientName(clientId: number): string {
  return this.clientNames[clientId] || 'Cliente no encontrado';
}

  // Método para abrir el modal de búsqueda de clientes
  openClientSearchModal(): void {
    const dialogRef = this.dialog.open(ClientSearchModalComponent, {
      width: '600px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.id !== undefined) { // Verifica que result.id no sea undefined
        const client = result;
        this.newContributionForm.patchValue({
          clientId: client.id, // Asigna el clientId al formulario
          clientName: `${client.firstName} ${client.lastName}` // Asigna el nombre del cliente
        });
  
        // Almacena el nombre del cliente en el objeto clientNames
        this.clientNames[client.id] = `${client.firstName} ${client.lastName}`;
      } else {
        console.error('El cliente no tiene un ID válido:', result);
      }
    });
  }
  
  // Cargar el pago grupal y sus contribuciones
  loadGroupPayment(id: number): void {
    this.groupPaymentService.getGroupPaymentById(id).subscribe({
      next: (response: CustomApiResponse<GroupPaymentDTO>) => {
        this.payment = response.data; // Accede a response.data
        if (!this.payment.contributions) {
          this.payment.contributions = []; // Inicializa el array si no existe
        }
  
        // Crear un array de observables para cargar los nombres de los clientes
        const clientRequests = this.payment.contributions
          .filter(contribution => contribution.clientId !== undefined && !this.clientNames[contribution.clientId])
          .map(contribution => this.clientService.getClientById(contribution.clientId));
  
        // Realizar todas las solicitudes HTTP en paralelo
        forkJoin(clientRequests).subscribe({
          next: (clientResponses: CustomApiResponse<Client>[]) => {
            clientResponses.forEach(clientResponse => {
              const client = clientResponse.data; // Accede a clientResponse.data
              if (client.id !== undefined) {
                this.clientNames[client.id] = `${client.firstName} ${client.lastName}`;
              }
            });
          },
          error: (err) => {
            console.error('Error al obtener los clientes:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener el pago grupal:', err);
      }
    });
  }
  

  // Agregar una contribución al array local de this.payment.contributions
 

  addContribution(): void {
    console.log('Estado del formulario:', this.newContributionForm.valid);
    console.log('Valores del formulario:', this.newContributionForm.value);
    console.log('Pago grupal:', this.payment);

    if (this.newContributionForm.invalid) {
      console.error('El formulario no es válido:', this.newContributionForm.errors);
      return;
    }
  
    if (!this.payment) {
      console.error('El pago grupal no está cargado.');
      return;
    }

    if (this.newContributionForm.valid && this.payment) {
      const newAmount = this.newContributionForm.value.amountPaid;
      const currentTotal = this.payment.contributions.reduce((sum, c) => sum + (c.amountPaid || 0), 0);
      const totalAfterAdding = currentTotal + newAmount;
  
      console.log('Monto total permitido:', this.payment.totalAmount);
      console.log('Total actual de contribuciones:', currentTotal);
      console.log('Nueva contribución:', newAmount);
      console.log('Total después de agregar:', totalAfterAdding);
  
      // Verificar si la nueva contribución sobrepasa el monto total
      if (totalAfterAdding > this.payment.totalAmount) {
        this.responseMessage = 'No se puede agregar esta contribución porque excede el monto total permitido.';
        this.dialog.open(ResponseModalComponent, { data: { message: this.responseMessage } });
        return; // Detener la ejecución
      }
  
      const newContribution: GroupPaymentContributionDTO = {
        id: 0, // Se generará en el backend
        clientId: this.newContributionForm.value.clientId,
        amountPaid: newAmount,
        contributionDate: this.newContributionForm.value.contributionDate,
        paymentMethod: this.newContributionForm.value.paymentMethod
      };
  
      if (!this.payment.contributions) {
        this.payment.contributions = [];
      }
  
      // Agregar la contribución localmente
      this.payment.contributions.push(newContribution);
      this.payment.contributions = [...this.payment.contributions];
  
      // Limpiar el formulario después de agregar
      this.newContributionForm.reset({
        clientId: null,
        clientName: '',
        amountPaid: 0,
        contributionDate: new Date(),
        paymentMethod: ''
      });
  
      console.log('Contribución agregada con éxito:', newContribution);
  
      this.cdr.detectChanges();
    } else {
      console.error('El formulario no es válido o payment es null');
    }
  }
  
  // Guardar (update) el pago grupal con las nuevas contribuciones
  saveChanges(): void {
    // Usar el operador de aserción no nula (!) para decirle a TypeScript que this.payment no es null
    if (!this.payment!.serviceType || !this.payment!.totalAmount) {
        this.responseMessage = 'Los campos "Tipo de Servicio" y "Monto Total" son obligatorios.';
        this.dialog.open(ResponseModalComponent, { data: { message: this.responseMessage } });
        return;
    }

    // Abrir el modal de confirmación
    const confirmDialogRef = this.dialog.open(ConfirmationModalComponent, {
        data: { message: '¿Estás seguro de que deseas guardar los cambios?' }
    });

    console.log(this.payment!,this.payment!.id);

    confirmDialogRef.afterClosed().pipe(
        switchMap((confirmResult: boolean) => {
            if (confirmResult) {
                // Si el usuario confirma, proceder a guardar los cambios
                return this.groupPaymentService.updateGroupPayment(this.payment!.id, this.payment!);
            } else {
                // Si el usuario cancela, devolver un observable vacío
                return of(null);
            }
        })
    ).subscribe({
        next: (response: CustomApiResponse<GroupPaymentDTO> | null) => {
            if (response && response.data) {
                console.log('Pago grupal actualizado:', response.data);
                this.payment = response.data; // Accede a response.data

                // Mostrar el modal de respuesta exitosa
                this.dialog.open(ResponseModalComponent, {
                    data: { message: 'Los cambios se guardaron correctamente.' }
                });
            } else {
                console.log('Guardado cancelado por el usuario');
            }
        },
        error: (err) => {
            console.error('Error al actualizar el pago grupal:', err);

            // Mostrar el modal de respuesta de error
            this.dialog.open(ResponseModalComponent, {
                data: { message: 'Hubo un error al guardar los cambios.' }
            });
        }
    });
}
  goBack(): void {
    this.router.navigate(['/group-payments']); // Ajusta la ruta según la que uses para volver
  }

  removeContribution(index: number): void {
    if (this.payment && this.payment.contributions) {
      // Mostrar un modal de confirmación antes de eliminar
      const confirmDialogRef = this.dialog.open(ConfirmationModalComponent, {
        data: { message: '¿Estás seguro de que deseas eliminar esta contribución?' }
      });
  
      confirmDialogRef.afterClosed().subscribe(confirmResult => {
        if (confirmResult) {
          // Eliminar la contribución del array
          this.payment!.contributions.splice(index, 1);
  
          // Forzar actualización de la vista
          this.payment!.contributions = [...this.payment!.contributions];
  
          //console.log('Contribución eliminada. Lista actualizada:', this.payment.contributions);
          this.cdr.detectChanges();
        }
      });
    }
  }
  
  printPaymentDetails(): void {
    if (!this.payment) {
      console.error("No hay datos de pago para imprimir.");
      return;
    }
  
    const printContent = `
      <html>
      <head>
        <title>Detalles del Pago Grupal</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 40px; 
            padding: 20px; 
            background: #f5f5f5; 
            color: #333;
          }
          h2 { 
            color: #3f51b5; 
            text-align: center; 
            border-bottom: 3px solid #3f51b5; 
            padding-bottom: 10px; 
            margin-bottom: 20px;
          }
          .container {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            margin: auto;
          }
          p {
            font-size: 1.1rem;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 1rem;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #3f51b5;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .total-amount { 
            font-weight: bold; 
            color: #4caf50;
            font-size: 1.2rem;
          }
          .payment-status {
            font-weight: bold; 
            color: ${this.payment.status === 'COMPLETED' ? '#4caf50' : '#f44336'}; 
            text-transform: uppercase;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9rem;
            color: #757575;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Detalles del Pago Grupal</h2>
          <p><strong>ID:</strong> ${this.payment.id}</p>
          <p><strong>Tipo de Servicio:</strong> ${this.payment.serviceType}</p>
          <p><strong>Monto Total:</strong> <span class="total-amount">S/ ${this.payment.totalAmount?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p><strong>Monto Reembolsado:</strong> S/ ${this.payment.reimbursedAmount?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
          <p><strong>Monto Pendiente:</strong> S/ ${this.payment.pendingReimbursement?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
          <p><strong>Fecha de Pago:</strong> ${this.payment.paymentDate ? new Date(this.payment.paymentDate).toLocaleDateString('es-PE') : 'N/A'}</p>
          <p><strong>Método de Pago:</strong> ${this.payment.paymentMethod}</p>
          <p><strong>Estado:</strong> <span class="payment-status">${this.payment.status}</span></p>
  
          <h3>Contribuciones</h3>
          ${this.payment.contributions && this.payment.contributions.length > 0 ? `
            <table>
              <tr>
                <th>Cliente ID</th>
                <th>Nombre</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Método</th>
              </tr>
              ${this.payment.contributions.map(c => `
                <tr>
                  <td>${c.clientId}</td>
                  <td>${this.getClientName(c.clientId)}</td>
                  <td>S/ ${c.amountPaid?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${c.contributionDate ? new Date(c.contributionDate).toLocaleDateString('es-PE') : 'N/A'}</td>
                  <td>${c.paymentMethod}</td>
                </tr>
              `).join('')}
            </table>
          ` : `
            <p>No hay contribuciones registradas.</p>
          `}
  
          <p class="footer">Generado automáticamente el ${new Date().toLocaleDateString('es-PE')} - ${new Date().toLocaleTimeString('es-PE')}</p>
        </div>
      </body>
      </html>
    `;
  
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }
  
  
}
