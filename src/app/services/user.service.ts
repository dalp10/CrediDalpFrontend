import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; // URL de la API para usuarios
  private rolesUrl = 'http://localhost:8080/api/roles'; // URL de la API para roles

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    const token = localStorage.getItem('jwt_token'); // Obtén el token desde localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User[]>(this.apiUrl, { headers: headers });
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<User> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  // Crear un nuevo usuario
  createUser(user: User): Observable<User> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<User>(this.apiUrl, user, { headers: headers });
  }

  // Actualizar un usuario existente
  updateUser(id: number, user: User): Observable<User> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers: headers });
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<void> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  // Obtener todos los roles
  getRoles(): Observable<Role[]> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Role[]>(this.rolesUrl, { headers: headers });
  }

  // Verificar si el nombre de usuario existe
  checkUsernameExists(username: string): Observable<boolean> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<boolean>(`${this.apiUrl}/exists?username=${username}`, {
      headers: headers,
    });
  }
}