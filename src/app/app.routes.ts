import { Routes } from '@angular/router';

// Componentes sin layout
import { LoginComponent } from './auth/login/login.component';

// Layout principal
import { LayoutComponent } from './core/layaout/layout/layout.component';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Usuarios
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserCreateComponent } from './users/user-create/user-create.component';

// Clientes
import { ClientListComponent } from './client/client-list/client-list.component';
import { ClientCreateComponent } from './client/client-create/client-create.component';

// Préstamos
import { LoanListComponent } from './loan/loan-list/loan-list.component';
import { LoanCreateComponent } from './loan/loan-create/loan-create.component';
import { LoanEditComponent } from './loan/loan-edit/loan-edit.component';

// Créditos
import { CreditListComponent } from './credit/credit-list/credit-list.component';
import { CreateCreditComponent } from './credit/create-credit/create-credit.component';
// import { EditCreditComponent } from './credit/edit-credit/edit-credit.component'; // si lo necesitas

// Pagos
import { PaymentListComponent } from './payments/payment-list.component';
import { SinglePaymentComponent } from './single-payment/single-payment.component';
// import { PaymentDetailComponent } from './payments/payment-detail/payment-detail.component'; // si lo necesitas

// Pagos Grupales
import { GroupPaymentListComponent } from './group-payment/group-payment-list/group-payment-list.component';
import { GroupPaymentFormComponent } from './group-payment/group-payment-form/group-payment-form.component';
import { GroupPaymentDetailComponent } from './group-payment/group-payment-detail/group-payment-detail.component';

export const routes: Routes = [
  // Ruta sin layout
  { path: 'login', component: LoginComponent },

  // Ruta principal con layout
  {
    path: '',
    component: LayoutComponent,
    children: [
      // Dashboard
      { path: 'dashboard', component: DashboardComponent },

      // Usuarios
      { path: 'list-user', component: UserListComponent },
      { path: 'create-user', component: UserCreateComponent },
      { path: 'edit-user/:id', component: UserEditComponent },

      // Clientes
      { path: 'list-client', component: ClientListComponent },
      { path: 'create-client', component: ClientCreateComponent },
      { path: 'edit-client/:id', component: ClientCreateComponent },

      // Préstamos
      { path: 'loans', component: LoanListComponent },
      { path: 'create-loan', component: LoanCreateComponent },
      { path: 'edit-loan/:id', component: LoanEditComponent },

      // Créditos
      { path: 'credits', component: CreditListComponent },
      { path: 'create-credit', component: CreateCreditComponent },
      // { path: 'edit-credit/:id', component: EditCreditComponent },

      // Pagos
      { path: 'payments', component: PaymentListComponent },
      { path: 'single-payment', component: SinglePaymentComponent },
      // { path: 'payment-detail/:id', component: PaymentDetailComponent },

      // Pagos Grupales
      { path: 'group-payments', component: GroupPaymentListComponent },
      { path: 'group-payments/detail/:id', component: GroupPaymentDetailComponent },
      { path: 'create-group-payment', component: GroupPaymentFormComponent },
      { path: 'edit-group-payment/:id', component: GroupPaymentFormComponent },

      // Redirige a dashboard por defecto
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },

  // Redirige a login si la ruta no existe
  { path: '**', redirectTo: '/login' },
];
