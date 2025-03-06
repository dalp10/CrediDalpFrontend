import { Component, inject, ViewChild, TemplateRef } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Client } from '../../models/client.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent {
  clients: Client[] = [];
  clientIdToDelete: number | null = null;
  backendMessage: string = '';

  // Referencias a los modales
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
  @ViewChild('deleteResponseModal') deleteResponseModal!: TemplateRef<any>;

  private clientService = inject(ClientService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  constructor() {
    this.loadClients();
  }

  // Cargar la lista de clientes
  loadClients(): void {
    this.clientService.getAllClients().subscribe((data) => {
      this.clients = data;
    });
  }

  // Navegar al formulario de edición
  editClient(client: Client): void {
    this.router.navigate(['/edit-client', client.id]);
  }

  // Abre el modal de confirmación y guarda el ID del cliente a eliminar
  openDeleteModal(id: number): void {
    this.clientIdToDelete = id;
    this.modalService.open(this.deleteModal);
  }

  // Confirma la eliminación: cierra el modal de confirmación y abre el modal con el mensaje del backend.
  confirmDeletion(modalRef: NgbModalRef): void {
    if (this.clientIdToDelete !== null) {
      this.clientService.deleteClient(this.clientIdToDelete).subscribe({
        next: (response: string) => {
          // Guardar el mensaje del backend
          this.backendMessage = response;
          // Recargar la lista de clientes
          this.loadClients();
          // Limpiar la variable de ID
          this.clientIdToDelete = null;
          // Cerrar el modal de confirmación
          modalRef.dismiss();
          // Abrir el modal con el mensaje del backend
          this.modalService.open(this.deleteResponseModal).result
            .then(() => {
              // Al cerrar, se recarga la lista (ya se hizo)
            })
            .catch(() => {});
        },
        error: (err) => {
          console.error('Error al eliminar el cliente:', err);
          this.backendMessage = 'Error al eliminar el cliente.';
          modalRef.dismiss();
          this.modalService.open(this.deleteResponseModal).result
            .then(() => {})
            .catch(() => {});
        }
      });
    } else {
      console.error('No hay un cliente seleccionado para eliminar');
    }
  }
}
