import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('jwt_token');

    if (token && !this.isTokenExpired(token)) {
      return true;
    }

    // Si no hay token o está vencido
    this.router.navigate(['/login']);
    return false;
  }

  // Verifica si el token está expirado
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // decodifica la parte intermedia del JWT
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000); // tiempo actual en segundos

      return exp < now;
    } catch (e) {
      console.error('Error al verificar expiración del token', e);
      return true;
    }
  }
}
