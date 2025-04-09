import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LucideIconsModule } from '../../shared/modules/lucide-icons.module';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    LucideIconsModule, // ✅ Ya listo para usar íconos
  ],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      state('out', style({ transform: 'translateX(-100%)' })),
      transition('in <=> out', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class SidebarComponent {
  @Input() open: boolean = false;
  @Output() closed = new EventEmitter<void>();

  closeSidebar() {
    this.closed.emit();
  }

  icons = {
    dashboard: 'Home',
    usuarios: 'Users',
    clientes: 'User',
    prestamos: 'HandCoins',
    creditos: 'CreditCard',
    pagos: 'Wallet',
    grupales: 'Users',
    lista: 'List',
  };
  
  
  
}
