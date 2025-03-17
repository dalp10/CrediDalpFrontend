import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { CustomApiResponse } from '../models/custom-api-response.model'; // Importa el nuevo modelo de respuesta

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) {}

  // Obtener todos los roles
  getRoles(): Observable<CustomApiResponse<Role[]>> {
    return this.http.get<CustomApiResponse<Role[]>>(this.apiUrl);
  }
}