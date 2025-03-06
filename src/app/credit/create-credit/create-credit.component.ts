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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreditService } from '../../services/credit.service';
import { Credit } from '../../models/credit.model';
import { CommonModule } from '@angular/common';
import { ClientSearchModalComponent } from '../../shared/client-search-modal/client-search-modal.component';
import { CreditStatus } from '../../models/credit.model';
import { PaymentScheduleModalComponent } from '../../shared/payment-schedule-modal/payment-schedule-modal.component';
import { formatDate } from '@angular/common';

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
    MatDialogModule,
  ],
  templateUrl: './create-credit.component.html',
  styleUrls: ['./create-credit.component.css'],
})
export class CreateCreditComponent implements OnInit {
  creditForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private creditService: CreditService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.creditForm = this.fb.group({
      capitalAmount: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      gracePeriodDays: [{ value: '', disabled: true }, Validators.required],
      clientId: ['', Validators.required],
      numberOfInstallments: ['', [Validators.required, Validators.min(1)]],
      tea: ['', [Validators.required, Validators.min(0)]],
      firstPaymentDate: [new Date(), Validators.required],
    });

    // Escuchar cambios en las fechas para calcular los días de gracia
    this.creditForm.get('startDate')?.valueChanges.subscribe(() => this.calculateGracePeriodDays());
    this.creditForm.get('firstPaymentDate')?.valueChanges.subscribe(() => this.calculateGracePeriodDays());
  }

  ngOnInit(): void {}

  calculateGracePeriodDays(): void {
    const startDate = this.creditForm.get('startDate')?.value;
    const firstPaymentDate = this.creditForm.get('firstPaymentDate')?.value;

    if (startDate && firstPaymentDate) {
      const start = new Date(startDate);
      const firstPayment = new Date(firstPaymentDate);

      if (isNaN(start.getTime())) {
        console.error('Fecha de inicio no válida:', startDate);
        return;
      }

      if (isNaN(firstPayment.getTime())) {
        console.error('Fecha del primer pago no válida:', firstPaymentDate);
        return;
      }

      // Restar un mes a la fecha del primer pago para obtener el primer vencimiento
      const firstDueDate = new Date(firstPayment);
      firstDueDate.setMonth(firstDueDate.getMonth() - 1);

      // Calcular la diferencia de días entre la fecha de inicio y un mes antes del primer pago
      const diffTime = Math.abs(firstDueDate.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Asignar el valor al campo gracePeriodDays
      this.creditForm.get('gracePeriodDays')?.setValue(diffDays);
    }
  }

  openClientSearchModal(): void {
    const dialogRef = this.dialog.open(ClientSearchModalComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((clientId: number) => {
      if (clientId) {
        this.creditForm.get('clientId')?.setValue(clientId);
      }
    });
  }

  // Función formatDate actualizada para aceptar un formato personalizado
  private formatDate(date: Date | string | null | undefined, format: string = 'yyyy-MM-dd'): string {
    if (!date) {
      date = new Date();
    }

    if (typeof date === 'string') {
      date = new Date(date);
    }

    return formatDate(date, format, 'en-US');
  }

  async onSubmit(): Promise<void> {
    if (this.creditForm.invalid || this.isSubmitting) {
      this.snackBar.open('Por favor, complete el formulario correctamente', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
  
    this.isSubmitting = true;
  
    try {
      this.creditForm.get('gracePeriodDays')?.enable();
  
      const {
        capitalAmount,
        startDate,
        gracePeriodDays,
        clientId,
        numberOfInstallments,
        tea,
        firstPaymentDate,
      } = this.creditForm.value;
  
      // Convertir las fechas al formato "yyyy-MM-dd"
      const formattedStartDate = this.formatDate(startDate);
      const formattedFirstPaymentDate = this.formatDate(firstPaymentDate);
  
      // Crear el objeto crédito
      const credit: Credit = {
        capitalAmount,
        startDate: formattedStartDate,
        gracePeriodDays,
        clientId,
        status: CreditStatus.ACTIVE,
      };
  
      // Llamada al servicio para calcular las cuotas
      const installments = await this.creditService
        .calculatePaymentSchedule(credit, numberOfInstallments, gracePeriodDays, tea, formattedFirstPaymentDate)
        .toPromise();
  
      // Verificar si installments está definido y no está vacío
      if (!installments || installments.length === 0) {
        throw new Error('No se pudo calcular el calendario de pagos.');
      }
  
      // Calcular la fecha de vencimiento
      const dueDate = new Date(firstPaymentDate);
      dueDate.setMonth(dueDate.getMonth() + numberOfInstallments - 1);
  
      // Datos del crédito para mostrar en el modal
      const creditDetails = {
        amount: `S/ ${capitalAmount.toFixed(2)}`, // Importe solicitado
        installmentAmount: `S/ ${installments[0].amount.toFixed(2)}`, // Cuota (tomamos la primera cuota como ejemplo)
        duration: `${numberOfInstallments} meses`, // Duración total
        requestDate: this.formatDate(startDate, 'dd/MM/yyyy'), // Fecha de solicitud
        dueDate: this.formatDate(dueDate, 'dd/MM/yyyy'), // Fecha de vencimiento
        paymentDay: new Date(firstPaymentDate).getDate(), // Día de pago
        tea: `${tea}%`, // Tasa Efectiva Anual
      };
  
      // Abrir el modal con los datos del crédito y las cuotas
      const dialogRef = this.dialog.open(PaymentScheduleModalComponent, {
        width: '800px',
        data: { installments, creditDetails },
      });
  
      const confirmed = await dialogRef.afterClosed().toPromise();
      if (confirmed) {
        await this.creditService
          .createCredit(credit, numberOfInstallments, gracePeriodDays, tea, formattedFirstPaymentDate)
          .toPromise();
  
        this.snackBar.open('Crédito creado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.creditForm.reset();
      }
    } catch (err) {
      this.snackBar.open('Error al procesar la solicitud', 'Cerrar', {
        duration: 3000,
      });
      console.error(err);
    } finally {
      this.creditForm.get('gracePeriodDays')?.disable();
      this.isSubmitting = false;
    }
  }
}