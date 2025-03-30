import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credit } from '../models/credit.model';
import { Installment } from '../models/installment.model';
import { CustomApiResponse } from '../models/custom-api-response.model'; // Importa el nuevo modelo de respuesta
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  private apiUrl = `${environment.apiUrl}/credits`;

  constructor(private http: HttpClient) {}

  // Crear un nuevo crédito
  createCredit(
    credit: Credit,
    numberOfInstallments: number,
    gracePeriodDays: number,
    tea: number,
    firstPaymentDate: string
  ): Observable<CustomApiResponse<Credit>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    });

    const params = new HttpParams()
      .set('numberOfInstallments', numberOfInstallments.toString())
      .set('gracePeriodDays', gracePeriodDays.toString())
      .set('tea', tea.toString())
      .set('firstPaymentDate', firstPaymentDate);

    return this.http.post<CustomApiResponse<Credit>>(this.apiUrl, credit, { headers, params });
  }

  // Obtener créditos por cliente
  getCreditsByClient(clientId: number): Observable<CustomApiResponse<Credit[]>> {
    return this.http.get<CustomApiResponse<Credit[]>>(`${this.apiUrl}/client/${clientId}`);
  }

  // Pagar una cuota
  payInstallment(installmentId: number): Observable<CustomApiResponse<Installment>> {
    return this.http.post<CustomApiResponse<Installment>>(
      `${this.apiUrl}/installments/${installmentId}/pay`,
      {}
    );
  }

  // Calcular el calendario de pagos
  calculatePaymentSchedule(
    credit: Credit,
    numberOfInstallments: number,
    gracePeriodDays: number,
    tea: number,
    firstPaymentDate: string
  ): Observable<CustomApiResponse<Installment[]>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    });

    const params = new HttpParams()
      .set('numberOfInstallments', numberOfInstallments.toString())
      .set('gracePeriodDays', gracePeriodDays.toString())
      .set('tea', tea.toString())
      .set('firstPaymentDate', firstPaymentDate);

    return this.http.post<CustomApiResponse<Installment[]>>(
      `${this.apiUrl}/calculate-payment-schedule`,
      credit,
      { headers, params }
    );
  }
}