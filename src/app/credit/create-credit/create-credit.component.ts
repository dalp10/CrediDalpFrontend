import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Importa MatDialog
import { CreditService } from '../../services/credit.service';
import { Credit } from '../../models/credit.model';
import { CommonModule } from '@angular/common';
import { ClientSearchModalComponent } from '../../shared/client-search-modal/client-search-modal.component';
import { CreditStatus } from '../../models/credit.model';

@Component({
  selector: 'app-create-credit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule, // Agrega MatDialogModule
  ],
  templateUrl: './create-credit.component.html',
  styleUrls: ['./create-credit.component.css'],
})
export class CreateCreditComponent implements OnInit {
  creditForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private creditService: CreditService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog // Inyecta MatDialog como propiedad pública
  ) {
    this.creditForm = this.fb.group({
      capitalAmount: ['', [Validators.required, Validators.min(0)]],
      interestRate: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      gracePeriodDays: ['', [Validators.required, Validators.min(0)]],
      clientId: ['', Validators.required],
      numberOfInstallments: ['', [Validators.required, Validators.min(1)]],
      tea: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {}

  openClientSearchModal(): void {
    const dialogRef = this.dialog.open(ClientSearchModalComponent, {
      width: '600px', // Ancho del modal
    });

    dialogRef.afterClosed().subscribe((clientId: number) => {
      if (clientId) {
        this.creditForm.get('clientId')?.setValue(clientId); // Asigna el ID del cliente seleccionado
      }
    });
  }

  onSubmit(): void {
    if (this.creditForm.valid) {
      const { capitalAmount, interestRate, startDate, endDate, gracePeriodDays, clientId, numberOfInstallments, tea } = this.creditForm.value;

      const credit: Credit = {
        capitalAmount,
        interestRate,
        startDate,
        endDate,
        gracePeriodDays,
        clientId,
        status: CreditStatus.ACTIVE, // Asigna un estado por defecto
      };

      this.creditService
        .createCredit(credit, numberOfInstallments, gracePeriodDays, tea)
        .subscribe({
          next: (response) => {
            this.snackBar.open('Crédito creado exitosamente', 'Cerrar', {
              duration: 3000,
            });
            this.creditForm.reset();
          },
          error: (err) => {
            this.snackBar.open('Error al crear el crédito', 'Cerrar', {
              duration: 3000,
            });
            console.error(err);
          },
        });
    } else {
      this.snackBar.open('Por favor, complete el formulario correctamente', 'Cerrar', {
        duration: 3000,
      });
    }
  }
}