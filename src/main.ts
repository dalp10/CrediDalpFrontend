/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// 📌 Función para obtener el token del LocalStorage
export function tokenGetter() {
  return localStorage.getItem('token');
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:8080'], // 📌 Servidor backend
          disallowedRoutes: ['http://localhost:8080/api/auth/login'],
        },
      })
    ),
    provideRouter(routes),
  ]
}).catch(err => console.error(err));
