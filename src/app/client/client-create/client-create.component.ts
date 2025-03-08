import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ResponseModalComponent } from '../../shared/modals/response-modal/response-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css']
})
export class ClientCreateComponent implements OnInit {
  clientForm: FormGroup;
  clientId: number | null = null;
  isEditMode = false;
  backendMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.clientId = +idParam;
        this.isEditMode = true;
        this.loadClient(this.clientId);
      }
    });
  }

  loadClient(id: number): void {
    this.clientService.getClientById(id).subscribe({
      next: (client: Client) => {
        this.clientForm.patchValue({
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          documentNumber: client.documentNumber
        });
      },
      error: (err) => {
        console.error('Error al cargar el cliente:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { message: this.isEditMode ? '¿Está seguro de que desea actualizar el cliente?' : '¿Está seguro de que desea crear el cliente?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.isEditMode && this.clientId !== null) {
          this.clientService.updateClient(this.clientId, this.clientForm.value).subscribe({
            next: (response) => {
              this.backendMessage = response;
              this.openResponseModal();
            },
            error: (err: HttpErrorResponse) => {
              this.backendMessage = err.error;
              this.openResponseModal();
            }
          });
        } else {
          this.clientService.createClient(this.clientForm.value).subscribe({
            next: (response) => {
              this.backendMessage = response;
              this.openResponseModal();
            },
            error: (err: HttpErrorResponse) => {
              this.backendMessage = err.error;
              this.openResponseModal();
            }
          });
        }
      }
    });
  }

  openResponseModal(): void {
    const dialogRef = this.dialog.open(ResponseModalComponent, {
      data: { message: this.backendMessage }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/list-client']);
    });
  }

  cancelOperation(): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { message: '¿Seguro que deseas cancelar la operación? Los cambios no guardados se perderán.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/list-client']);
      }
    });
  }
}