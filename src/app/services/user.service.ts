import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { CustomApiResponse } from '../models/custom-api-response.model'; // Importa el nuevo modelo de respuesta

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private rolesUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<CustomApiResponse<User[]>> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<CustomApiResponse<User[]>>(this.apiUrl, { headers });
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<CustomApiResponse<User>> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<CustomApiResponse<User>>(`${this.apiUrl}/${id}`, { headers });
  }

  // Crear un nuevo usuario
  createUser(user: User): Observable<CustomApiResponse<User>> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<CustomApiResponse<User>>(this.apiUrl, user, { headers });
  }

  // Actualizar un usuario existente
  updateUser(id: number, user: User): Observable<CustomApiResponse<User>> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<CustomApiResponse<User>>(`${this.apiUrl}/${id}`, user, { headers });
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<CustomApiResponse<string>> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<CustomApiResponse<string>>(`${this.apiUrl}/${id}`, { headers });
  }

  // Obtener todos los roles
  getRoles(): Observable<CustomApiResponse<Role[]>> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<CustomApiResponse<Role[]>>(this.rolesUrl, { headers });
  }

  // Verificar si el nombre de usuario existe
  checkUsernameExists(username: string): Observable<CustomApiResponse<boolean>> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<CustomApiResponse<boolean>>(`${this.apiUrl}/exists?username=${username}`, {
      headers,
    });
  }
}