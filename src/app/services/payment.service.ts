import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { Credit } from '../models/credit.model';
import { Loan } from '../models/loan.model';
import { Installment } from '../models/installment.model';
import { PaymentLoanDTO, PaymentCreditDTO } from '../DTO/payment-dto';
import { CustomApiResponse } from '../models/custom-api-response.model'; // Importa el nuevo modelo de respuesta
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}`;


  constructor(private http: HttpClient) {}

  // Buscar cliente por nombre o documento
  searchClients(query: string): Observable<CustomApiResponse<Client[]>> {
    return this.http.get<CustomApiResponse<Client[]>>(`${this.apiUrl}/clients/search?query=${query}`);
  }

  // Buscar créditos por código
  searchCredits(query: string): Observable<CustomApiResponse<Credit[]>> {
    return this.http.get<CustomApiResponse<Credit[]>>(`${this.apiUrl}/credits/search?query=${query}`);
  }

  // Obtener créditos de un cliente
  getCreditsByClient(clientId: number): Observable<CustomApiResponse<Credit[]>> {
    return this.http.get<CustomApiResponse<Credit[]>>(`${this.apiUrl}/credits/client/${clientId}`);
  }

  // Obtener préstamos de un cliente
  getLoansByClient(clientId: number): Observable<CustomApiResponse<Loan[]>> {
    return this.http.get<CustomApiResponse<Loan[]>>(`${this.apiUrl}/clients/${clientId}/loans`);
  }

  // Obtener cuotas de un crédito
  getInstallmentsByCreditId(creditId: number): Observable<CustomApiResponse<Installment[]>> {
    return this.http.get<CustomApiResponse<Installment[]>>(`${this.apiUrl}/credits/${creditId}/installments`);
  }

  // Realizar un pago sobre una cuota de un crédito
  payInstallment(installmentId: number, payment: PaymentCreditDTO): Observable<CustomApiResponse<Installment>> {
    return this.http.post<CustomApiResponse<Installment>>(
      `${this.apiUrl}/credits/installments/${installmentId}/pay`,
      payment
    );
  }

  // Realizar un pago sobre un préstamo
  makeLoanPayment(loanId: number, payment: PaymentLoanDTO): Observable<CustomApiResponse<PaymentLoanDTO>> {
    return this.http.post<CustomApiResponse<PaymentLoanDTO>>(
      `${this.apiUrl}/payments/loans/${loanId}`,
      payment
    );
  }

  // Obtener los pagos de un préstamo por su ID
  getPaymentsByLoanId(loanId: number): Observable<CustomApiResponse<PaymentLoanDTO[]>> {
    return this.http.get<CustomApiResponse<PaymentLoanDTO[]>>(`${this.apiUrl}/payments/loans/${loanId}`);
  }

  // Obtener los pagos de un crédito por su ID
  getPaymentsByCreditId(creditId: number): Observable<CustomApiResponse<PaymentCreditDTO[]>> {
    return this.http.get<CustomApiResponse<PaymentCreditDTO[]>>(`${this.apiUrl}/payments/credits/${creditId}`);
  }
}