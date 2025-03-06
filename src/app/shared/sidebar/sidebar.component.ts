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
          { name: 'Crear Usuario', route: '/create-user', icon: 'fas fa-plus' },
          // { name: 'Editar Usuario', route: '/edit-user/:id', icon: 'fas fa-edit' }
        ]
      },
      { 
        name: 'Clientes', icon: 'fas fa-user-friends', isOpen: false, 
        children: [
          { name: 'Listar Clientes', route: '/list-client', icon: 'fas fa-list' },
          { name: 'Crear Cliente', route: '/create-client', icon: 'fas fa-plus' },
          // { name: 'Editar Cliente', route: '/edit-client/:id', icon: 'fas fa-edit' }
        ]
      },
      { 
        name: 'Préstamos', icon: 'fas fa-hand-holding-usd', isOpen: false, 
        children: [
          { name: 'Listar Préstamos', route: '/loans', icon: 'fas fa-list' },
          { name: 'Crear Préstamo', route: '/create-loan', icon: 'fas fa-plus' },
          // { name: 'Editar Préstamo', route: '/edit-loan/:id', icon: 'fas fa-edit' }
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

  ngOnInit() {
    this.role = this.getUserRole() || 'user'; // Asigna 'user' como valor por defecto si role es null
}

getUserRole(): string | null {
    const role = localStorage.getItem('role');
    return role ? role.toLowerCase() : null;
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSubmenu(item: MenuItem) {
    item.isOpen = !item.isOpen;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }
}
