import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { Credit } from '../models/credit.model';
import { Loan } from '../models/loan.model';
import { Installment } from '../models/installment.model';
import { PaymentDTO } from '../DTO/PaymentDTO';// Asegúrate de tener este modelo definido

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api'; // URL del backend

  constructor(private http: HttpClient) {}

  // Buscar cliente por documento o nombre
  searchClients(query: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients/search?query=${query}`);
  }

  // Buscar crédito por código
  searchCredits(query: string): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/credits/search?query=${query}`);
  }

  // Obtener créditos de un cliente
  getCreditsByClient(clientId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/credits/client/${clientId}`);
  }

  // Obtener créditos de un cliente
  getLoansByClient(clientId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans/client/${clientId}`);
  }


  // Obtener cuotas de un crédito
  getInstallmentsByCredit(creditId: number): Observable<Installment[]> {
    return this.http.get<Installment[]>(`${this.apiUrl}/credits/${creditId}/installments`);
  }

  // Realizar un pago sobre una cuota de un préstamo Credit
  payInstallment(paymentDTO: any): Observable<Installment> {
    return this.http.post<Installment>(`${this.apiUrl}/payments/pay`, paymentDTO);
  }

  // Realizar un pago sobre un préstamo Loan
  makePayment(loanId: number, payment: PaymentDTO): Observable<string> {
    return this.http.post(`${this.apiUrl}/payments/${loanId}`, payment, { responseType: 'text' });
  }
  

  // Obtener los pagos de un préstamo por su ID
  getPaymentsByLoanId(loanId: number): Observable<PaymentDTO[]> {
    return this.http.get<PaymentDTO[]>(`${this.apiUrl}/payments?loanId=${loanId}`);
  }
}