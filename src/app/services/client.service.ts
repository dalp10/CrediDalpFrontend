import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { Loan } from '../models/loan.model';
import { Credit } from '../models/credit.model';
import { CustomApiResponse } from '../models/custom-api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  // Obtener todos los clientes
  getAllClients(): Observable<CustomApiResponse<Client[]>> {
    return this.http.get<CustomApiResponse<Client[]>>(this.apiUrl);
  }

  // Obtener un cliente por ID
  getClientById(id: number): Observable<CustomApiResponse<Client>> {
    return this.http.get<CustomApiResponse<Client>>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo cliente
  createClient(client: Client): Observable<CustomApiResponse<Client>> {
    return this.http.post<CustomApiResponse<Client>>(this.apiUrl, client);
  }

  // Actualizar un cliente existente
  updateClient(id: number, updatedClient: Client): Observable<CustomApiResponse<Client>> {
    return this.http.put<CustomApiResponse<Client>>(`${this.apiUrl}/${id}`, updatedClient);
  }

  // Eliminar un cliente
  deleteClient(id: number): Observable<CustomApiResponse<string>> {
    return this.http.delete<CustomApiResponse<string>>(`${this.apiUrl}/${id}`);
  }

  // Verificar si el número de documento ya está registrado
  isDocumentNumberExists(documentNumber: string): Observable<CustomApiResponse<boolean>> {
    const params = new HttpParams().set('documentNumber', documentNumber);
    return this.http.get<CustomApiResponse<boolean>>(`${this.apiUrl}/exists`, { params });
  }

  // Obtener los créditos de un cliente por su ID
  getCreditsByClientId(clientId: number): Observable<CustomApiResponse<Credit[]>> {
    return this.http.get<CustomApiResponse<Credit[]>>(`${this.apiUrl}/${clientId}/credits`);
  }

  // Obtener los préstamos de un cliente por su ID
  getLoansByClientId(clientId: number): Observable<CustomApiResponse<Loan[]>> {
    return this.http.get<CustomApiResponse<Loan[]>>(`${this.apiUrl}/${clientId}/loans`);
  }
}