import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { faUser, faLock, faEye, faEyeSlash, faSignInAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, CommonModule, FontAwesomeModule]
})
export class LoginComponent {
  // Íconos de FontAwesome
  faUser = faUser; // Ícono de usuario
  faLock = faLock; // Ícono de candado (contraseña)
  faEye = faEye; // Ícono de ojo abierto (ver contraseña)
  faEyeSlash = faEyeSlash; // Ícono de ojo cerrado (ocultar contraseña)
  faSignInAlt = faSignInAlt; // Ícono de inicio de sesión
  faSpinner = faSpinner; // Ícono de spinner (carga)

  user = { username: '', password: '' }; // Objeto para almacenar las credenciales
  showPassword = false; // Controla si se muestra la contraseña
  successMessage: string | null = null; // Mensaje de éxito o error
  isSuccess: boolean = true; // Indica si el mensaje es de éxito o error

  constructor(private authService: AuthService, private router: Router) {}

  // Método para realizar el login
  login() {
    if (!this.validateUsername(this.user.username)) {
      this.successMessage = 'El nombre de usuario debe tener al menos 4 letras mayúsculas.';
      this.isSuccess = false;
      return;
    }

    this.authService.login(this.user).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);

        // Verifica si la respuesta contiene un token y un rol
        if (response.token && response.role) {
          console.log('Token y rol recibidos:', response.token, response.role);

          // Guarda el token y el rol en el localStorage
          this.authService.saveToken(response.token);
          this.authService.saveRole(response.role);

          // Muestra un mensaje de éxito con spinner
          this.successMessage = 'Redirigiendo...';
          this.isSuccess = true;

          // Simula una carga antes de redirigir
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000); // Redirige después de 2 segundos
        } else if (response.message) {
          // Si hay un mensaje de error, muéstralo
          console.log('Mensaje de error:', response.message);
          this.successMessage = response.message;
          this.isSuccess = false;
        }
      },
      error: (err) => {
        // Maneja errores de conexión con el backend
        console.error('Error en login:', err);
        this.successMessage = 'Error al conectar con el servidor';
        this.isSuccess = false;
      }
    });
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Validación personalizada para el campo username
  validateUsername(username: string): boolean {
    const regex = /^[A-Z]{4,}$/; // Solo letras mayúsculas y mínimo 4 caracteres
    return regex.test(username);
  }
}