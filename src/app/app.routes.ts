import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { ClientListComponent } from './client/client-list/client-list.component';
import { ClientCreateComponent } from './client/client-create/client-create.component';

// Componentes para préstamos
import { LoanListComponent } from './loan/loan-list/loan-list.component';  // Lista de préstamos
import { LoanCreateComponent } from './loan/loan-create/loan-create.component';  // Crear préstamo
import { LoanEditComponent } from './loan/loan-edit/loan-edit.component';  // Editar préstamo

// Componentes para créditos
import { CreditListComponent } from './credit/credit-list/credit-list.component';  // Lista de créditos
import { CreateCreditComponent } from './credit/create-credit/create-credit.component';  // Crear crédito
//import { EditCreditComponent } from './credit/edit-credit/edit-credit.component';  // Editar crédito

// Componente de layout
import { LayoutComponent } from './core/layaout/layout/layout.component';

// Nuevos componentes para pagos
import { PaymentListComponent } from './payments/payment-list.component'; // Lista de pagos
//import { PaymentDetailComponent } from './paymentsnent';  // Detalle de pago

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Ruta sin layout

  {
    path: '', // Ruta principal que usa el layout
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent }, // Ruta hija con layout

      // Rutas para usuarios
      { path: 'list-user', component: UserListComponent }, // Lista de usuarios
      { path: 'create-user', component: UserCreateComponent }, // Crear usuario
      { path: 'edit-user/:id', component: UserEditComponent }, // Editar usuario

      // Rutas para clientes
      { path: 'list-client', component: ClientListComponent }, // Lista de clientes
      { path: 'create-client', component: ClientCreateComponent }, // Crear cliente
      { path: 'edit-client/:id', component: ClientCreateComponent }, // Editar cliente

      // Rutas para préstamos
      { path: 'loans', component: LoanListComponent }, // Lista de préstamos
      { path: 'create-loan', component: LoanCreateComponent }, // Crear préstamo
      { path: 'edit-loan/:id', component: LoanEditComponent }, // Editar préstamo

      // Rutas para créditos
      { path: 'credits', component: CreditListComponent }, // Lista de créditos
      { path: 'create-credit', component: CreateCreditComponent }, // Crear crédito
      //{ path: 'edit-credit/:id', component: EditCreditComponent }, // Editar crédito

      // Rutas para pagos
      { path: 'payments', component: PaymentListComponent }, // Lista de pagos
      //{ path: 'payment-detail/:id', component: PaymentDetailComponent }, // Detalle de pago

      // Redirige a dashboard por defecto
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },

  // Redirige a login si la ruta no existe
  { path: '**', redirectTo: '/login' },
];