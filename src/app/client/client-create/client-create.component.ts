import { Component, OnInit, ViewChild, TemplateRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faEnvelope, faPhone, faIdCard, faSave, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css']
})
export class ClientCreateComponent implements OnInit {
  clientForm: FormGroup;
  clientId: number | null = null;
  isEditMode = false;
  backendMessage: string = '';

  @ViewChild('confirmModal') confirmModal!: TemplateRef<any>;
  @ViewChild('responseModal') responseModal!: TemplateRef<any>;
  @ViewChild('cancelModal') cancelModal!: TemplateRef<any>;

  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  constructor() {
    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
    });

    library.add(faUser, faEnvelope, faPhone, faIdCard, faSave, faTimes, faCheck); // Agrega los iconos que vas a usar
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
        console.log('Cliente cargado:', client);
      },
      error: (err) => {
        console.error('Error al cargar el cliente:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      console.log('Formulario inválido');
      return;
    }
  
    // Abre el modal de confirmación
    const modalRef = this.modalService.open(this.confirmModal);
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        // Si el usuario confirma, procede con la acción
        if (this.isEditMode && this.clientId !== null) {
          // Actualizar cliente
          this.clientService.updateClient(this.clientId, this.clientForm.value).subscribe({
            next: (response) => {
              this.backendMessage = response;
              this.openResponseModal(); // Abre el modal de respuesta
            },
            error: (err: HttpErrorResponse) => {
              this.backendMessage = err.error;
              this.openResponseModal(); // Abre el modal de respuesta en caso de error
            }
          });
        } else {
          // Crear cliente
          this.clientService.createClient(this.clientForm.value).subscribe({
            next: (response) => {
              this.backendMessage = response;
              this.openResponseModal(); // Abre el modal de respuesta
            },
            error: (err: HttpErrorResponse) => {
              this.backendMessage = err.error;
              this.openResponseModal(); // Abre el modal de respuesta en caso de error
            }
          });
        }
      } else {
        console.log('Se canceló la confirmación');
      }
    }).catch((reason) => {
      console.log('Modal de confirmación descartado:', reason);
    });
  }
  
  openResponseModal(): void {
    const modalRef = this.modalService.open(this.responseModal);
    modalRef.result.then(() => {
      this.router.navigate(['/list-client']); // Redirige después de cerrar el modal
    }).catch(() => {
      this.router.navigate(['/list-client']); // Redirige si el modal se descarta
    });
  }

  openCancelModal(): void {
    // Abre el modal de cancelación
    const modalRef = this.modalService.open(this.cancelModal);
    modalRef.result.then(() => {
      // Si el modal se confirma, redirige a la lista de clientes
      this.router.navigate(['/list-client']);
    }).catch(() => {
      // Si el modal se descarta, redirige también
      this.router.navigate(['/list-client']);
    });
  }
  

  cancelOperation(): void {
    this.modalService.dismissAll();
    this.router.navigate(['/list-client']);
  }
}