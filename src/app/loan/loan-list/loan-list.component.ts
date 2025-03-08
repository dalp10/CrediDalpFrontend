import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { ConfirmationModalComponent } from '../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ResponseModalComponent } from '../../shared/modals/response-modal/response-modal.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar'; // Para notificaciones
import { LoanDetailsModalComponent } from '../../shared/modals/loan-details-modal/loan-details-modal.component';
import * as XLSX from 'xlsx'; // Importa la biblioteca xlsx

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  standalone: true,
  styleUrls: ['./loan-list.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgxPaginationModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
  ],
})
export class LoanListComponent implements OnInit {
  loans: any[] = [];
  filteredLoans: any[] = [];
  searchText: string = '';
  selectedLoan: any = null;
  responseMessage: string = '';
  loanToDelete: any = null;

  // Paginación
  page: number = 1;
  pageSize: number = 5;

  // Columnas para la tabla de Angular Material
  displayedColumns: string[] = [
    'id',
    'client',
    'amount',
    'interestRate',
    'status',
    'loanCode',
    'actions',
  ];

  constructor(
    private loanService: LoanService,
    private clientService: ClientService,
    private dialog: MatDialog, // Inyecta MatDialog
    private snackBar: MatSnackBar // Inyecta MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getLoans().subscribe(
      (loans: any[]) => {
        this.clientService.getAllClients().subscribe(
          (clients: any[]) => {
            this.loans = loans.map((loan) => ({
              ...loan,
              client: clients.find((client) => client.id === loan.clientId) || {
                firstName: 'Sin cliente',
                lastName: '',
              },
            }));
            this.filteredLoans = this.loans;
          },
          (error) => {
            this.showError('Error al cargar los clientes');
          }
        );
      },
      (error) => {
        this.showError('Error al cargar los préstamos');
      }
    );
  }

  applyFilter(): void {
    this.filteredLoans = this.loans.filter((loan) =>
      `${loan.client.firstName} ${loan.client.lastName}`
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  openLoanDetails(loan: any): void {
    this.dialog.open(LoanDetailsModalComponent, {
      width: '600px',
      data: {
        loan: loan, // Pasamos el préstamo completo al modal
      },
    });
  }

  getLoanDetailsMessage(loan: any): string {
    return `
      ID: ${loan.id}
      Cliente: ${loan.client.firstName} ${loan.client.lastName}
      Monto: ${loan.amount}
      Tasa de Interés: ${loan.interestRate}%
      Estado: ${loan.status}
      Código: ${loan.loanCode}
    `;
  }

  deleteLoan(loanId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { message: '¿Estás seguro de que deseas eliminar este préstamo?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loanService.deleteLoan(loanId).subscribe(
          (response) => {
            this.showSuccess('Préstamo eliminado con éxito');
            this.loadLoans(); // Recargar la lista de préstamos
          },
          (error) => {
            this.showError('Error al eliminar el préstamo');
          }
        );
      }
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }

  // Dentro de la clase LoanListComponent, agrega el método exportToExcel
  exportToExcel(): void {
    const data = this.filteredLoans.map((loan) => ({
      ID: loan.id,
      Cliente: `${loan.client.firstName} ${loan.client.lastName}`,
      Monto: loan.amount,
      'Tasa de Interés': loan.interestRate,
      Estado: loan.status,
      'Código': loan.loanCode,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Préstamos');

    // Guardar el archivo
    XLSX.writeFile(wb, 'prestamos.xlsx');
  }
}