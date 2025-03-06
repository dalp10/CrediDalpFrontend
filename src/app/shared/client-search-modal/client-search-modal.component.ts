import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-search-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    FormsModule, // Agrega FormsModule aquí
  ],
  templateUrl: './client-search-modal.component.html',
  styleUrls: ['./client-search-modal.component.css'],
})
export class ClientSearchModalComponent implements OnInit {
  clients: Client[] = []; // Lista de clientes
  filteredClients: Client[] = []; // Lista filtrada de clientes
  searchText: string = ''; // Texto de búsqueda

  // Columnas a mostrar en la tabla
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'documentNumber', 'select'];

  constructor(
    public dialogRef: MatDialogRef<ClientSearchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientService // Inyecta ClientService
  ) {}

  ngOnInit(): void {
    this.loadClients(); // Carga los clientes al iniciar el modal
  }

  // Carga la lista de clientes desde el servicio
  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filteredClients = clients; // Inicialmente, muestra todos los clientes
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      },
    });
  }

  // Filtra la lista de clientes según el texto de búsqueda
  filterClients(): void {
    if (this.searchText) {
      const searchTextLower = this.searchText.toLowerCase();
      this.filteredClients = this.clients.filter((client) =>
        client.firstName.toLowerCase().includes(searchTextLower) ||
        client.lastName.toLowerCase().includes(searchTextLower) ||
        client.email.toLowerCase().includes(searchTextLower) ||
        client.documentNumber.toLowerCase().includes(searchTextLower)
      );
    } else {
      this.filteredClients = this.clients; // Si no hay texto de búsqueda, muestra todos los clientes
    }
  }

  // Selecciona un cliente y cierra el modal
  selectClient(client: Client): void {
    this.dialogRef.close(client.id); // Devuelve el ID del cliente seleccionado
  }

  // Cierra el modal sin seleccionar
  onCancel(): void {
    this.dialogRef.close();
  }
}