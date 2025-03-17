import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  name: string;
  route?: string;
  icon?: string;
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent implements OnInit {
  role: string | null = null;
  isCollapsed = false;
  isDarkTheme = false;

  menuItems: Record<string, MenuItem[]> = {
    admin: [
      { name: 'Dashboard', route: '/dashboard', icon: 'fas fa-home' },
      { 
        name: 'Usuarios', icon: 'fas fa-users', isOpen: false, 
        children: [
          { name: 'Listar Usuarios', route: '/list-user', icon: 'fas fa-list' },
          { name: 'Crear Usuario', route: '/create-user', icon: 'fas fa-plus' }
        ]
      },
      { 
        name: 'Clientes', icon: 'fas fa-user-friends', isOpen: false, 
        children: [
          { name: 'Listar Clientes', route: '/list-client', icon: 'fas fa-list' },
          { name: 'Crear Cliente', route: '/create-client', icon: 'fas fa-plus' }
        ]
      },
      { 
        name: 'Préstamos', icon: 'fas fa-hand-holding-usd', isOpen: false, 
        children: [
          { name: 'Listar Préstamos', route: '/loans', icon: 'fas fa-list' },
          { name: 'Crear Préstamo', route: '/create-loan', icon: 'fas fa-plus' }
        ]
      },
      { 
        name: 'Créditos', icon: 'fas fa-credit-card', isOpen: false, 
        children: [
          { name: 'Listar Créditos', route: '/credits', icon: 'fas fa-list' },
          { name: 'Crear Crédito', route: '/create-credit', icon: 'fas fa-plus' }
        ]
      },
      { 
        name: 'Pagos', icon: 'fas fa-money-check-alt', isOpen: false, 
        children: [
          { name: 'Listado de Pagos', route: '/payments', icon: 'fas fa-list' },
          { name: 'Pago Único', route: '/single-payment', icon: 'fas fa-hand-holding-usd' }
        ]
      },
      { 
        name: 'Pagos Grupales', icon: 'fas fa-users-crown', isOpen: false, 
        children: [
          { name: 'Listado de Pagos Grupales', route: '/group-payments', icon: 'fas fa-list' },
          { name: 'Crear Pago Grupal', route: '/create-group-payment', icon: 'fas fa-plus' }
        ]
      },
      { name: 'Configuración', route: '/configuracion', icon: 'fas fa-cog' }
    ],
    user: [
      { name: 'Inicio', route: '/dashboard', icon: 'fas fa-home' },
      { name: 'Perfil', route: '/perfil', icon: 'fas fa-user' }
    ]
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.role = this.getUserRole() || 'user';
  }

  getUserRole(): string | null {
    const role = localStorage.getItem('role');
    return role ? role.toLowerCase() : null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSubmenu(item: MenuItem): void {
    item.isOpen = !item.isOpen;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }
}
