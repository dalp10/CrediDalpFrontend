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
import { CustomApiResponse } from '../../models/custom-api-response.model';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar // Inyectar el servicio
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
      next: (response: CustomApiResponse<Client>) => {
        // Verificar que la respuesta y los datos sean válidos
        if (!response.data) {
          console.error('La respuesta del backend no contiene datos válidos.');
          this.snackBar.open('No se pudo cargar el cliente. Por favor, inténtelo de nuevo.', 'Cerrar', {
            duration: 3000,
          });
          return;
        }
  
        const client = response.data; // Extraer el objeto Client de la respuesta
  
        // Actualizar el formulario con los datos del cliente
        this.clientForm.patchValue({
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          documentNumber: client.documentNumber
        });
      },
      error: (err: HttpErrorResponse) => {
        // Manejar el error y mostrar un mensaje en la consola
        console.error('Error al cargar el cliente:', err);
  
        // Mostrar un mensaje de error al usuario
        this.snackBar.open('Error al cargar el cliente. Por favor, inténtelo de nuevo.', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  onSubmit(): void {
    // Verificar si el formulario es inválido
    if (this.clientForm.invalid) {
      this.snackBar.open('Por favor, complete el formulario correctamente.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
  
    // Abrir el modal de confirmación
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { 
        message: this.isEditMode ? '¿Está seguro de que desea actualizar el cliente?' : '¿Está seguro de que desea crear el cliente?' 
      }
    });
  
    // Manejar la respuesta del modal de confirmación
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (this.isEditMode && this.clientId !== null) {
          // Modo de edición: Actualizar el cliente
          this.clientService.updateClient(this.clientId, this.clientForm.value).subscribe({
            next: (response: CustomApiResponse<Client>) => {
              this.backendMessage = response.message || 'Cliente actualizado exitosamente.';
              this.openResponseModal();
            },
            error: (err: HttpErrorResponse) => {
              this.backendMessage = err.error?.message || 'Error al actualizar el cliente.';
              this.openResponseModal();
            }
          });
        } else {
          // Modo de creación: Crear un nuevo cliente
          this.clientService.createClient(this.clientForm.value).subscribe({
            next: (response: CustomApiResponse<Client>) => {
              this.backendMessage = response.message || 'Cliente creado exitosamente.';
              this.openResponseModal();
            },
            error: (err: HttpErrorResponse) => {
              this.backendMessage = err.error?.message || 'Error al crear el cliente.';
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