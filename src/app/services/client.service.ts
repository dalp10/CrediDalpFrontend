import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) { }

  // Obtener todos los clientes
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  // Crear un nuevo cliente
  createClient(client: Client): Observable<string> {
    return this.http.post(`${this.apiUrl}`, client, { responseType: 'text' as 'text' }) as Observable<string>;
  }

  // Actualizar un cliente
  updateClient(id: number, client: Client): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, client, { responseType: 'text' as 'text' }) as Observable<string>;
  }
  

    // Eliminar un cliente (actualizado para retornar un mensaje)
    deleteClient(id: number): Observable<string> {
      return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' as 'text' }) as Observable<string>;
    }

  // Validar si el número de documento existe
  isDocumentNumberExists(documentNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists?documentNumber=${documentNumber}`);
  }
  // Obtener un cliente por ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }
}
