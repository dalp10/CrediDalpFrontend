import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Importa HttpParams
import { Observable } from 'rxjs';
import { Credit } from '../models/credit.model';
import { Installment } from '../models/installment.model';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private apiUrl = 'http://localhost:8080/api/credits';

  constructor(private http: HttpClient) {}

  createCredit(
    credit: Credit,
    numberOfInstallments: number,
    gracePeriodDays: number,
    tea: number
  ): Observable<Credit> {
    // Configura los parámetros de la solicitud
    const params = new HttpParams()
      .set('numberOfInstallments', numberOfInstallments.toString())
      .set('gracePeriodDays', gracePeriodDays.toString())
      .set('tea', tea.toString());

    // Realiza la solicitud POST con los parámetros
    return this.http.post<Credit>(this.apiUrl, credit, { params });
  }

  getCreditsByClient(clientId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/client/${clientId}`);
  }

  payInstallment(installmentId: number): Observable<Installment> {
    return this.http.post<Installment>(`${this.apiUrl}/installments/${installmentId}/pay`, {});
  }
}