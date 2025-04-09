import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { Client } from '../../models/client.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ResponseModalComponent } from '../../shared/modals/response-modal/response-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CustomApiResponse } from '../../models/custom-api-response.model';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator,
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = []; // Lista de clientes
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phone', 'documentNumber', 'actions']; // Columnas de la tabla
  dataSource = new MatTableDataSource<Client>(); // Fuente de datos para la tabla
  backendMessage: string = ''; // Mensaje del backend (para modales)
  clientIdToDelete: number | null = null; // ID del cliente a eliminar

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginación

  constructor(
    private clientService: ClientService, // Servicio de clientes
    private router: Router, // Router para navegación
    private dialog: MatDialog, // Servicio de diálogos (modales)
    private snackBar: MatSnackBar // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    this.loadClients(); // Cargar la lista de clientes al iniciar
  }

  // Cargar la lista de clientes
  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (response: CustomApiResponse<Client[]>) => {
        // Verificar que la respuesta y los datos sean válidos
        if (!response.data) {
          console.error('La respuesta del backend no contiene datos válidos.');
          return;
        }
  
        // Asignar los clientes a la propiedad this.clients
        this.clients = response.data;
  
        // Asignar los datos a la fuente de la tabla
        this.dataSource.data = response.data;
  
        // Asignar el paginador si está disponible
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
  
        // Verificar si los clientes tienen créditos (si es necesario)
        if (response.data.every(client => client.hasCredits !== undefined)) {
          console.log('Todos los clientes tienen la propiedad "hasCredits".');
        } else {
          console.warn('Algunos clientes no tienen la propiedad "hasCredits".');
        }
      },
      error: (err) => {
        // Manejar el error y mostrar un mensaje en la consola
        console.error('Error al cargar los clientes:', err);
  
        // Opcional: Mostrar un mensaje de error al usuario
        this.snackBar.open('Error al cargar los clientes. Por favor, inténtelo de nuevo.', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
  // Aplicar filtro de búsqueda
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Filtrar datos
  }

  // Navegar al formulario de creación de cliente
  navigateToCreate(): void {
    this.router.navigate(['/create-client']);
  }

  // Navegar al formulario de edición de cliente
  editClient(client: Client): void {
    this.router.navigate(['/edit-client', client.id]);
  }

  // Abrir modal de confirmación para eliminar cliente
  openDeleteModal(id: number): void {
    this.clientIdToDelete = id;
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { message: '¿Está seguro de que desea eliminar este cliente?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmDeletion(); // Si el usuario confirma, eliminar el cliente
      }
    });
  }

  // Confirmar la eliminación del cliente
  confirmDeletion(): void {
    // Verificar que clientIdToDelete no sea null
    if (this.clientIdToDelete === null) {
      console.error('No se ha proporcionado un ID de cliente para eliminar.');
      return;
    }
  
    // Llamar al servicio para eliminar el cliente
    this.clientService.deleteClient(this.clientIdToDelete).subscribe({
      next: (response: CustomApiResponse<string>) => {
        // Asignar el mensaje del backend
        this.backendMessage = response.message || 'Cliente eliminado exitosamente.';
  
        // Recargar la lista de clientes
        this.loadClients();
  
        // Mostrar mensaje de éxito en el modal
        this.dialog.open(ResponseModalComponent, {
          data: { message: this.backendMessage }
        });
      },
      error: (err) => {
        // Manejar el error y mostrar un mensaje específico si está disponible
        const errorMessage = err.error?.message || 'Error al eliminar el cliente.';
        this.backendMessage = errorMessage;
  
        // Mostrar mensaje de error en el modal
        this.dialog.open(ResponseModalComponent, {
          data: { message: this.backendMessage }
        });
  
        // Registrar el error en la consola
        console.error('Error al eliminar el cliente:', err);
      }
    });

  }
  viewCredits(clientId: number): void {
    this.router.navigate(['/credits/client', clientId]);
  }
  
}