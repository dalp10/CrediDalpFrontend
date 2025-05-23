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
    MatCardModule
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
      next: (response) => {
        console.log('Respuesta del servicio:', response); // Depuración: Verifica la estructura de la respuesta
        if (response.statusCode === 200) { // Asegúrate de que response.status sea true o el valor correcto
          this.clients = response.data; // Asigna los datos a la lista de clientes
          this.filteredClients = response.data; // Filtra los clientes (inicialmente es igual a la lista completa)
          console.log('Clientes cargados con éxito:', this.clients); // Depuración: Verifica que los datos se asignaron correctamente
        } else {
          console.error('Error al cargar clientes:', response.message);
        }
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
    this.dialogRef.close(client); // Retorna solo el ID del cliente
  }
  // Cierra el modal sin seleccionar
  onCancel(): void {
    this.dialogRef.close();
  }
}