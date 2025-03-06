import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { ClientListComponent } from './client/client-list/client-list.component';
import { ClientCreateComponent } from './client/client-create/client-create.component';
import { LoanListComponent } from './loan/loan-list/loan-list.component';
import { LoanCreateComponent } from './loan/loan-create/loan-create.component';
import { LoanEditComponent } from './loan/loan-edit/loan-edit.component';
import { LayoutComponent } from './core/layaout/layout/layout.component';
// Nuevo componente para créditos
import { CreditListComponent } from './credit/credit-list/credit-list.component'; 
const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Ruta de login sin layout

  {
    path: '', // Ruta principal que usa el layout
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent }, // Ruta hija con layout
      { path: 'list-user', component: UserListComponent }, // Ruta hija con layout
      { path: 'create-user', component: UserCreateComponent }, // Ruta hija con layout
      { path: 'edit-user/:id', component: UserEditComponent }, // Ruta hija con layout
      { path: 'list-client', component: ClientListComponent }, // Ruta hija con layout
      { path: 'create-client', component: ClientCreateComponent }, // Ruta hija con layout
      { path: 'edit-client/:id', component: ClientCreateComponent }, // Ruta hija con layout
      { path: 'loans', component: LoanListComponent }, // Ruta hija con layout
      { path: 'create-loan', component: LoanCreateComponent }, // Ruta hija con layout
      { path: 'edit-loan/:id', component: LoanEditComponent }, // Ruta hija con layout
      { path: 'credits', component: CreditListComponent }, // Nueva ruta para la lista de créditos
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirige a dashboard por defecto
    ],
  },

  { path: '**', redirectTo: '/login' }, // Redirige a login si la ruta no existe
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}