import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard'; // 👈 Importa tu guard

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [AuthGuard], // 🔐 Protege todas las rutas hijas
    loadComponent: () =>
      import('./core/layaout/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'list-user',
        loadComponent: () =>
          import('./users/user-list/user-list.component').then((m) => m.UserListComponent),
      },
      {
        path: 'create-user',
        loadComponent: () =>
          import('./users/user-create/user-create.component').then((m) => m.UserCreateComponent),
      },
      {
        path: 'edit-user/:id',
        loadComponent: () =>
          import('./users/user-edit/user-edit.component').then((m) => m.UserEditComponent),
      },
      {
        path: 'list-client',
        loadComponent: () =>
          import('./client/client-list/client-list.component').then((m) => m.ClientListComponent),
      },
      {
        path: 'create-client',
        loadComponent: () =>
          import('./client/client-create/client-create.component').then((m) => m.ClientCreateComponent),
      },
      {
        path: 'edit-client/:id',
        loadComponent: () =>
          import('./client/client-create/client-create.component').then((m) => m.ClientCreateComponent),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./loan/loan-list/loan-list.component').then((m) => m.LoanListComponent),
      },
      {
        path: 'create-loan',
        loadComponent: () =>
          import('./loan/loan-create/loan-create.component').then((m) => m.LoanCreateComponent),
      },
      {
        path: 'edit-loan/:id',
        loadComponent: () =>
          import('./loan/loan-edit/loan-edit.component').then((m) => m.LoanEditComponent),
      },
      {
        path: 'credits',
        loadComponent: () =>
          import('./credit/credit-list/credit-list.component').then((m) => m.CreditListComponent),
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
