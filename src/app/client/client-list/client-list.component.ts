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
    private dialog: MatDialog // Servicio de diálogos (modales)
  ) {}

  ngOnInit(): void {
    this.loadClients(); // Cargar la lista de clientes al iniciar
  }

  // Cargar la lista de clientes
  loadClients(): void {
    this.clientService.getAllClients().subscribe((data) => {
      console.log(data); // Verifica que la respuesta incluya "hasCredits"
      this.clients = data;
      this.dataSource.data = data; // Asignar datos a la fuente de la tabla
      this.dataSource.paginator = this.paginator; // Asignar paginación
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
    if (this.clientIdToDelete !== null) {
      this.clientService.deleteClient(this.clientIdToDelete).subscribe({
        next: (response: string) => {
          this.backendMessage = response; // Mensaje del backend
          this.loadClients(); // Recargar la lista de clientes
          this.dialog.open(ResponseModalComponent, {
            data: { message: this.backendMessage } // Mostrar mensaje de éxito
          });
        },
        error: (err) => {
          this.backendMessage = 'Error al eliminar el cliente.'; // Mensaje de error
          this.dialog.open(ResponseModalComponent, {
            data: { message: this.backendMessage } // Mostrar mensaje de error
          });
        }
      });
    }
  }
}