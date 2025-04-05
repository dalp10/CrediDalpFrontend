import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Método de Login con el Backend
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ token: string; role: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token && response.role) {
          console.log("Token y rol guardados:", response.token, response.role);
          this.saveToken(response.token);
          this.saveRole(response.role);
        }
      })
    );
  }

  // Guardar el token en LocalStorage
  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  // Guardar el rol en LocalStorage
  saveRole(role: string): void {
    localStorage.setItem('role', role);
  }

  // Obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Obtener el rol almacenado
  getUserRole(): string | null {
    const role = localStorage.getItem('role');
    console.log("🔹 Rol obtenido desde LocalStorage:", role); // 🔹 Verificar si el rol se está guardando correctamente
    return role;
  }
  
  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Logout (Eliminar el token y rol)
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
