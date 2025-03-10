import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GroupPaymentDTO } from '../DTO/group-payment-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupPaymentService {
  private apiUrl = 'http://localhost:8080/api/group-payments';

  constructor(private http: HttpClient) {}

  getAllGroupPayments(): Observable<GroupPaymentDTO[]> {
    return this.http.get<GroupPaymentDTO[]>(this.apiUrl);
  }

  getGroupPaymentById(id: number): Observable<GroupPaymentDTO> {
    return this.http.get<GroupPaymentDTO>(`${this.apiUrl}/${id}`);
  }

  createGroupPayment(payment: GroupPaymentDTO): Observable<GroupPaymentDTO> {
    return this.http.post<GroupPaymentDTO>(this.apiUrl, payment);
  }

  updateGroupPayment(id: number, payment: GroupPaymentDTO): Observable<GroupPaymentDTO> {
    return this.http.put<GroupPaymentDTO>(`${this.apiUrl}/${id}`, payment);
  }

  deleteGroupPayment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
