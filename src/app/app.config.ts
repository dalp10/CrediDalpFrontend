import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core'; // Importa provideNativeDateAdapter

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Configuración existente
    provideNativeDateAdapter(), // Añade esta línea para proporcionar el NativeDateAdapter
  ],
};