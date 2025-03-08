import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientSearchModalComponent } from '../../shared/client-search-modal/client-search-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfirmationModalComponent } from '../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ResponseModalComponent } from '../../shared/modals/response-modal/response-modal.component';

@Component({
  selector: 'app-loan-create',
  templateUrl: './loan-create.component.html',
  styleUrls: ['./loan-create.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
  ],
})
export class LoanCreateComponent implements OnInit {
  loan = {
    amount: 0,
    interestRate: 0,
    issueDate: null as Date | null,
    dueDate: null as Date | null,
    client: null as Client | null,
    clientName: '',
  };

  minDueDate: Date | null = null;

  constructor(
    private loanService: LoanService,
    private clientService: ClientService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.loan.issueDate = today;
    this.updateDueDate();
  }

  onIssueDateChange(): void {
    this.updateDueDate();
  }

  updateDueDate(): void {
    if (this.loan.issueDate) {
      const issueDate = new Date(this.loan.issueDate);
      const dueDate = new Date(issueDate);
      dueDate.setMonth(issueDate.getMonth() + 1);
      this.loan.dueDate = dueDate;
      this.minDueDate = dueDate;
    }
  }

  openClientSearchModal(): void {
    const dialogRef = this.dialog.open(ClientSearchModalComponent, {
      width: '600px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((selectedClientId: number) => {
      if (selectedClientId) {
        this.clientService.getClientById(selectedClientId).subscribe((client) => {
          this.loan.client = client;
          this.loan.clientName = `${client.firstName} ${client.lastName}`;
        });
      }
    });
  }

  openConfirmationModal(): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { message: '¿Estás seguro de que deseas crear este préstamo?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmit(); // Si el usuario confirma, envía el formulario
      }
    });
  }

  onSubmit(): void {
    if (this.loan.client === null || this.loan.clientName === '') {
      alert('Por favor, selecciona un cliente.');
      return;
    }
    if (this.loan.amount <= 0) {
      alert('El monto del préstamo debe ser mayor que cero.');
      return;
    }
    if (this.loan.interestRate <= 0) {
      alert('La tasa de interés debe ser mayor que cero.');
      return;
    }
    if (!this.loan.issueDate || !this.loan.dueDate) {
      alert('Por favor, asegúrate de seleccionar las fechas correctamente.');
      return;
    }

    this.loanService.createLoan(this.loan).subscribe(
      (response) => {
        this.dialog.open(ResponseModalComponent, {
          width: '400px',
          data: { message: 'Préstamo creado exitosamente' },
        });
        this.router.navigate(['/list-loan']);
      },
      (err: HttpErrorResponse) => {
        this.dialog.open(ResponseModalComponent, {
          width: '400px',
          data: { message: err.error },
        });
      }
    );
  }
}