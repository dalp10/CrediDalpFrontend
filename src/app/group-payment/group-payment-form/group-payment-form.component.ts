import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PaymentMethod } from '../../models/PaymentMethod.model';
import { GroupPaymentDTO } from '../../DTO/group-payment-dto.model';
import { GroupPaymentService } from '../../services/group-payment.service';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ClientSearchModalComponent } from '../../shared/client-search-modal/client-search-modal.component';

@Component({
  selector: 'app-group-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './group-payment-form.component.html',
  styleUrls: ['./group-payment-form.component.css']
})
export class GroupPaymentFormComponent implements OnInit {
  groupPaymentForm: FormGroup;
  paymentMethods = Object.values(PaymentMethod);

  constructor(
    private fb: FormBuilder,
    private groupPaymentService: GroupPaymentService,
    private router: Router,
    private dialog: MatDialog
  ) {
    // Se agregan dos campos: payerId (oculto) y payerName (visible y de solo lectura)
    this.groupPaymentForm = this.fb.group({
      serviceType: ['', Validators.required],
      description: [''],
      totalAmount: [0, Validators.required],
      paymentDate: [new Date(), Validators.required],
      paymentMethod: ['', Validators.required],
      status: ['PENDING', Validators.required],
      payerId: [null, Validators.required],
      payerName: [''], // Este campo se mostrará para ver el nombre completo
      contributions: this.fb.array([]) // Se agregarán dinámicamente las contribuciones
    });
  }

  ngOnInit(): void {
    // Lógica adicional si es necesario
  }

  onSubmit(): void {
    if (this.groupPaymentForm.valid) {
      const paymentData: GroupPaymentDTO = this.groupPaymentForm.value;
      // Se envía el DTO sin el campo payerName (opcional, ya que el backend utiliza payerId)
      this.groupPaymentService.createGroupPayment(paymentData).subscribe({
        next: (response) => {
          console.log('Pago grupal creado:', response);
          this.router.navigate(['/group-payments']);
        },
        error: (err) => {
          console.error('Error al crear el pago grupal:', err);
        }
      });
    }
  }

  openClientSearchModal(): void {
    const dialogRef = this.dialog.open(ClientSearchModalComponent, {
      width: '600px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí `result` es el objeto completo del cliente
        const client = result;
        this.groupPaymentForm.patchValue({
          payerId: client.id,
          payerName: `${client.firstName} ${client.lastName}` // Muestra el nombre completo
        });
      }
    });
  }
}
