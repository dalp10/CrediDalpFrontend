import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomApiResponse } from '../models/custom-api-response.model'; // Importa el nuevo modelo de respuesta

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = 'http://localhost:8080/api/loans';

  constructor(private http: HttpClient) {}

  // Obtener todos los préstamos
  getLoans(): Observable<CustomApiResponse<any[]>> {
    return this.http.get<CustomApiResponse<any[]>>(this.apiUrl);
  }

  // Obtener un préstamo por ID
  getLoanById(id: number): Observable<CustomApiResponse<any>> {
    return this.http.get<CustomApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo préstamo
  createLoan(loan: any): Observable<CustomApiResponse<any>> {
    return this.http.post<CustomApiResponse<any>>(this.apiUrl, loan);
  }

  // Actualizar un préstamo
  updateLoan(id: number, loan: any): Observable<CustomApiResponse<any>> {
    return this.http.put<CustomApiResponse<any>>(`${this.apiUrl}/${id}`, loan);
  }

  // Eliminar un préstamo
  deleteLoan(id: number): Observable<CustomApiResponse<string>> {
    return this.http.delete<CustomApiResponse<string>>(`${this.apiUrl}/${id}`);
  }
}