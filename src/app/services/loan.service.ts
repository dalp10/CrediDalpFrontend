import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = 'http://localhost:8080/api/loans';

  constructor(private http: HttpClient) {}

  // Obtener todos los préstamos
  getLoans(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Devuelve un arreglo de préstamos
  }

  // Obtener un préstamo por ID
  getLoanById(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'text' as 'text' }) as Observable<string>;
  }

  // Crear un nuevo préstamo
  createLoan(loan: any): Observable<string> {
    return this.http.post(this.apiUrl, loan, { responseType: 'text' as 'text' }) as Observable<string>;
  }

  // Actualizar un préstamo
  updateLoan(id: number, loan: any): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, loan, { responseType: 'text' as 'text' }) as Observable<string>;
  }

  // Eliminar un préstamo
  deleteLoan(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' as 'text' }) as Observable<string>;
  }
}