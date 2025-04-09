import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PaymentListComponent } from './payments/payment-list.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./core/layaout/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      // Dashboard y entidades principales
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

      // Créditos
      {
        path: 'credits',
        loadComponent: () =>
          import('./credit/credit-list/credit-list.component').then((m) => m.CreditListComponent),
      },
      {
        path: 'credits/client/:clientId',
        loadComponent: () =>
          import('./credit/credit-list/credit-list.component').then((m) => m.CreditListComponent),
      },
      {
        path: 'create-credit',
        loadComponent: () =>
          import('./credit/create-credit/create-credit.component').then((m) => m.CreateCreditComponent),
      },

      // Préstamos
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

      // Pagos individuales
      {
        path: 'payment-list',
        loadComponent: () =>
          import('./payments/payment-list.component').then((m) => m.PaymentListComponent),
      },
      {
        path: 'single-payment',
        loadComponent: () =>
          import('./single-payment/single-payment.component').then((m) => m.SinglePaymentComponent),
      },

      // Pagos grupales
      {
        path: 'group-payments',
        loadComponent: () =>
          import('./group-payment/group-payment-list/group-payment-list.component').then((m) => m.GroupPaymentListComponent),
      },
      {
        path: 'create-group-payment',
        loadComponent: () =>
          import('./group-payment/group-payment-form/group-payment-form.component').then((m) => m.GroupPaymentFormComponent),
      },
      {
        path: 'edit-group-payment/:id',
        loadComponent: () =>
          import('./group-payment/group-payment-form/group-payment-form.component').then((m) => m.GroupPaymentFormComponent),
      },
      {
        path: 'group-payments/detail/:id',
        loadComponent: () =>
          import('./group-payment/group-payment-detail/group-payment-detail.component').then((m) => m.GroupPaymentDetailComponent),
      },

      // Redirección por defecto
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
