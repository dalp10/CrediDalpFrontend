/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { provideNativeDateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { AppComponent } from './app/app.component';
import { provideRouter, withPreloading } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { routes } from './app/app.routes';

// ✅ Importación para habilitar animaciones
import { provideAnimations } from '@angular/platform-browser/animations';

// 📌 Función para obtener el token del LocalStorage
export function tokenGetter() {
  return localStorage.getItem('token');
}

// Registra el locale de Perú
registerLocaleData(localeEsPe);

// Bootstrap principal
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:8080'],
          disallowedRoutes: ['http://localhost:8080/api/auth/login'],
        },
      })
    ),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'es-PE' },

    // ✅ Animaciones habilitadas globalmente
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
