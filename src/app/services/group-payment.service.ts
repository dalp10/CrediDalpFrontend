import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupPaymentDTO } from '../DTO/group-payment-dto.model';
import { CustomApiResponse } from '../models/custom-api-response.model'; // Importa el nuevo modelo de respuesta
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupPaymentService {
  private apiUrl = `${environment.apiUrl}/group-payments`;

  constructor(private http: HttpClient) {}

  // Obtener todos los pagos grupales
  getAllGroupPayments(): Observable<CustomApiResponse<GroupPaymentDTO[]>> {
    return this.http.get<CustomApiResponse<GroupPaymentDTO[]>>(this.apiUrl);
  }

  // Obtener un pago grupal por ID
  getGroupPaymentById(id: number): Observable<CustomApiResponse<GroupPaymentDTO>> {
    return this.http.get<CustomApiResponse<GroupPaymentDTO>>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo pago grupal
  createGroupPayment(payment: GroupPaymentDTO): Observable<CustomApiResponse<GroupPaymentDTO>> {
    return this.http.post<CustomApiResponse<GroupPaymentDTO>>(this.apiUrl, payment);
  }

  // Actualizar un pago grupal
  updateGroupPayment(id: number, payment: GroupPaymentDTO): Observable<CustomApiResponse<GroupPaymentDTO>> {
    return this.http.put<CustomApiResponse<GroupPaymentDTO>>(`${this.apiUrl}/${id}`, payment);
  }

  // Eliminar un pago grupal
  deleteGroupPayment(id: number): Observable<CustomApiResponse<string>> {
    return this.http.delete<CustomApiResponse<string>>(`${this.apiUrl}/${id}`);
  }
}