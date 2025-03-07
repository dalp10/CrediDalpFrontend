import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // Importa HttpHeaders y HttpParams
import { Observable } from 'rxjs';
import { Client } from '../models/client.model'; // Asegúrate de tener la interfaz Client
import { Loan } from '../models/loan.model'; // Asegúrate de tener la interfaz Loan
import { Credit } from '../models/credit.model'; // Asegúrate de tener la interfaz Credit

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/api/clients'; // Cambia a la URL correcta de tu backend

  constructor(private http: HttpClient) {}

  // Obtener todos los clientes
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  // Obtener un cliente por ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo cliente
  createClient(client: Client): Observable<string> {
    return this.http.post<string>(this.apiUrl, client);
  }

  // Actualizar un cliente existente
  updateClient(id: number, updatedClient: Client): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}`, updatedClient);
  }

  // Eliminar un cliente
  deleteClient(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  // Verificar si el número de documento ya está registrado
  isDocumentNumberExists(documentNumber: string): Observable<boolean> {
    const params = new HttpParams().set('documentNumber', documentNumber);
    return this.http.get<boolean>(`${this.apiUrl}/exists`, { params });
  }

  // Obtener los créditos de un cliente por su ID
  getCreditsByClientId(clientId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/${clientId}/credits`);
  }

  // Obtener los préstamos de un cliente por su ID
  getLoansByClientId(clientId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/${clientId}/loans`);
  }
}
