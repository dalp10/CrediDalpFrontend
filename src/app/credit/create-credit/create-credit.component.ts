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
import { CreditStatus } from '../../enum/credit-status.model';
import { PaymentScheduleModalComponent } from '../../shared/payment-schedule-modal/payment-schedule-modal.component';
import { formatDate } from '@angular/common';
import { ClientService } from '../../services/client.service'; // Servicio para obtener clientes
import { Client } from '../../models/client.model';
import { lastValueFrom } from 'rxjs';
import { CustomApiResponse } from '../../models/custom-api-response.model';
import { Installment } from '../../models/installment.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs'; // Asegúrate de importar 'of' desde 'rxjs'

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
  minFirstPaymentDate: Date; // Fecha mínima para el primer pago (1 mes después de la fecha de inicio

  // Reemplazar loan por credit
  credit: Credit = {
    capitalAmount: 0,
    startDate: '',
    gracePeriodDays: 0,
    clientId: 0,
    client: null as Client | null,
    status: CreditStatus.ACTIVO,
    numberOfInstallments: 0,
    tea: 0,
    firstPaymentDate: ''
  };

  constructor(
    private fb: FormBuilder,
    private creditService: CreditService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private clientService: ClientService // Inyección del servicio de clientes
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
  
    this.minFirstPaymentDate = this.calculateFirstPaymentDate(new Date());
  }

  ngOnInit(): void {
    // Establecer la fecha de inicio como la fecha actual
    const today = new Date();
    this.creditForm.get('startDate')?.setValue(today);

    // Calcular la primera fecha de pago como 1 mes después de la fecha de inicio
    const firstPaymentDate = this.calculateFirstPaymentDate(today);
    this.creditForm.get('firstPaymentDate')?.setValue(firstPaymentDate);

    // Escuchar cambios en la fecha de inicio para actualizar la primera fecha de pago
    this.creditForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      if (startDate) {
        const firstPaymentDate = this.calculateFirstPaymentDate(startDate);
        this.creditForm.get('firstPaymentDate')?.setValue(firstPaymentDate);
        this.minFirstPaymentDate = firstPaymentDate; // Actualizar la fecha mínima
      }
    });
  }

  // Calcular la primera fecha de pago como 1 mes después de la fecha de inicio
  calculateFirstPaymentDate(startDate: Date): Date {
    const firstPaymentDate = new Date(startDate);
    firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
    return firstPaymentDate;
  }

  // Filtro para deshabilitar fechas anteriores a la fecha mínima
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date >= this.minFirstPaymentDate;
  };

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
      data: {},
    });

    dialogRef.afterClosed().subscribe((selectedClient: Client | null) => {
      if (selectedClient) {
        // Asignar el objeto cliente directamente
        this.credit.client = selectedClient;
        this.credit.clientId = selectedClient.id!;

        // Si necesitas asignar el ID del cliente al formulario, puedes hacerlo así:
        this.creditForm.get('clientId')?.setValue(selectedClient.id);
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
  
      // Convertir las fechas al formato ISO
      const formattedStartDate = this.formatDate(startDate);
      const formattedFirstPaymentDate = this.formatDate(firstPaymentDate);
  
      // Verificar si el cliente está definido
      if (!this.credit.client) {
        throw new Error('No se ha seleccionado un cliente válido.');
      }
  
      // Crear el objeto crédito
      const credit: Credit = {
        capitalAmount,
        startDate: formattedStartDate,
        gracePeriodDays,
        client: this.credit.client, // Asignar el objeto Client completo (no puede ser null)
        clientId: this.credit.clientId, // Asignar el ID del cliente
        status: CreditStatus.ACTIVO,
        numberOfInstallments,
        tea,
        firstPaymentDate: formattedFirstPaymentDate,
      };
  
      console.log(credit);
      // Calcular las cuotas
      const installmentsResponse: CustomApiResponse<Installment[]> = await lastValueFrom(
        this.creditService.calculatePaymentSchedule(credit, numberOfInstallments, gracePeriodDays, tea, formattedFirstPaymentDate)
      );
  
      if (!installmentsResponse.data || installmentsResponse.data.length === 0) {
        throw new Error('No se pudo calcular el calendario de pagos.');
      }
  
      const dueDate = new Date(firstPaymentDate);
      dueDate.setMonth(dueDate.getMonth() + numberOfInstallments - 1);
  
      const creditDetails = {
        amount: `S/ ${capitalAmount.toFixed(2)}`,
        installmentAmount: `S/ ${installmentsResponse.data[0].amount.toFixed(2)}`,
        duration: `${numberOfInstallments} meses`,
        requestDate: this.formatDate(startDate, 'dd/MM/yyyy'),
        dueDate: this.formatDate(dueDate, 'dd/MM/yyyy'),
        paymentDay: new Date(firstPaymentDate).getDate(),
        tea: `${tea}%`,
      };
  
      // Abrir el modal con los detalles del crédito
      const dialogRef = this.dialog.open(PaymentScheduleModalComponent, {
        width: '800px',
        data: { installments: installmentsResponse.data, creditDetails },
      });
  
      const confirmed = await lastValueFrom(dialogRef.afterClosed());
      if (confirmed) {
        await lastValueFrom(
          this.creditService.createCredit(credit, numberOfInstallments, gracePeriodDays, tea, formattedFirstPaymentDate)
        );
  
        this.snackBar.open('Crédito creado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.creditForm.reset();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido';
      this.snackBar.open(`Error: ${errorMessage}`, 'Cerrar', {
        duration: 3000,
      });
      console.error(err);
    } finally {
      this.creditForm.get('gracePeriodDays')?.disable();
      this.isSubmitting = false;
    }
  }
}