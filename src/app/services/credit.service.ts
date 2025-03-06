import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // Importa HttpHeaders y HttpParams
import { Observable } from 'rxjs';
import { Credit } from '../models/credit.model';
import { Installment } from '../models/installment.model';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  private apiUrl = 'http://localhost:8080/api/credits';

  constructor(private http: HttpClient) {}

  createCredit(
    credit: Credit,
    numberOfInstallments: number,
    gracePeriodDays: number,
    tea: number,
    firstPaymentDate: string 
  ): Observable<Credit> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Si usas autenticación
    });

    const params = new HttpParams()
      .set('numberOfInstallments', numberOfInstallments.toString())
      .set('gracePeriodDays', gracePeriodDays.toString())
      .set('tea', tea.toString())
      .set('firstPaymentDate', firstPaymentDate);

    return this.http.post<Credit>(this.apiUrl, credit, { headers, params });
  }

  getCreditsByClient(clientId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/client/${clientId}`);
  }

  payInstallment(installmentId: number): Observable<Installment> {
    return this.http.post<Installment>(`${this.apiUrl}/installments/${installmentId}/pay`, {});
  }

  calculatePaymentSchedule(
    credit: Credit,
    numberOfInstallments: number,
    gracePeriodDays: number,
    tea: number,
    firstPaymentDate: string
  ): Observable<Installment[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Si usas autenticación
    });

    const params = new HttpParams()
      .set('numberOfInstallments', numberOfInstallments.toString())
      .set('gracePeriodDays', gracePeriodDays.toString())
      .set('tea', tea.toString())
      .set('firstPaymentDate', firstPaymentDate);

    return this.http.post<Installment[]>(`${this.apiUrl}/calculate-payment-schedule`, credit, { headers, params });
  }
}