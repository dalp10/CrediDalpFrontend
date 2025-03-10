import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { MatCardModule } from '@angular/material/card';

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
    FormsModule,
    MatCardModule // <-- Agregado aquí
  ],
  templateUrl: './client-search-modal.component.html',
  styleUrls: ['./client-search-modal.component.css']
})
export class ClientSearchModalComponent implements OnInit {
  clients: Client[] = [];            // Lista completa de clientes
  filteredClients: Client[] = [];      // Lista filtrada según búsqueda
  searchText: string = '';             // Texto de búsqueda

  // Columnas a mostrar en la tabla
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'documentNumber', 'select'];

  constructor(
    public dialogRef: MatDialogRef<ClientSearchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // Carga la lista de clientes desde el servicio
  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filteredClients = clients;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  // Filtra la lista de clientes según el término de búsqueda
  filterClients(): void {
    const searchTextLower = this.searchText.toLowerCase();
    this.filteredClients = this.clients.filter((client) =>
      client.firstName.toLowerCase().includes(searchTextLower) ||
      client.lastName.toLowerCase().includes(searchTextLower) ||
      client.email.toLowerCase().includes(searchTextLower) ||
      client.documentNumber.toLowerCase().includes(searchTextLower)
    );
  }

  // Selecciona un cliente y cierra el modal retornando su ID
  selectClient(client: Client): void {
    this.dialogRef.close(client); // Retorna el objeto completo del cliente
  }
  
  // Cierra el modal sin seleccionar
  onCancel(): void {
    this.dialogRef.close();
  }
}
