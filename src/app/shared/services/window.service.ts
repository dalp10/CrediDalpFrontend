// src/app/shared/services/window.service.ts
import { Injectable, HostListener } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WindowService {
  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
