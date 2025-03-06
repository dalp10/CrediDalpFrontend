import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faKey, faUserTag, faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup;
  roles: Role[] = [];
  isLoading = false;
  userExists = false;
  backendMessage: string | null = null;
  isSuccess: boolean = false;

  @ViewChild('confirmModal') confirmModal!: TemplateRef<any>;
  @ViewChild('responseModal') responseModal!: TemplateRef<any>;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, this.validateUsername]], // Validación personalizada
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });

    library.add(faUser, faKey, faUserTag, faSave); // Agrega los iconos que vas a usar
  }

  ngOnInit(): void {
    this.userService.getRoles().subscribe((roles) => {
      this.roles = roles;
      console.log(roles);
    });

    this.userForm.get('username')?.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((username) => this.userService.checkUsernameExists(username))
      )
      .subscribe((exists) => {
        this.userExists = exists;
      });
  }


  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.userExists) {
      alert('¡El nombre de usuario ya está en uso!');
      return;
    }

    // Abrir el modal de confirmación
    this.modalService.open(this.confirmModal).result.then((result) => {
      if (result === 'confirm') {
        this.createUser();
      }
    }).catch(() => {
      console.log('Modal de confirmación descartado');
    });
  }

  createUser(): void {
    this.isLoading = true;

    const formValue = this.userForm.value;
    const role = this.roles.find((r) => r.id === Number(formValue.role));

    if (!role) {
      console.error('El rol seleccionado no es válido:', formValue.role);
      alert('El rol seleccionado no es válido.');
      this.isLoading = false;
      return;
    }

    const newUser = new User(formValue.username, formValue.password, role);
    this.userService.createUser(newUser).subscribe({
      next: (createdUser) => {
        this.isLoading = false;
        this.backendMessage = 'Usuario creado exitosamente';
        this.isSuccess = true;
        this.openResponseModal();
      },
      error: (error) => {
        this.isLoading = false;
        this.backendMessage = 'Error al crear el usuario: ' + error.message;
        this.isSuccess = false;
        this.openResponseModal();
      },
    });
  }

  openResponseModal(): void {
    this.modalService.open(this.responseModal).result.then(() => {
      if (this.isSuccess) {
        this.router.navigate(['/list-user']);
      }
    }).catch(() => {
      if (this.isSuccess) {
        this.router.navigate(['/list-user']);
      }
    });
  }

  
  // Validación personalizada para el campo username
validateUsername(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  // Validar que solo contenga letras mayúsculas
  const onlyLetters = /^[A-Z]+$/.test(value);

  // Validar que tenga exactamente 4 caracteres
  const isFourCharacters = value.length === 4;

  if (!onlyLetters || !isFourCharacters) {
    return { invalidUsername: true }; // Devuelve un error si no cumple las condiciones
  }

  return null; // No hay errores
}

convertToUppercase(event: Event): void {
  const input = event.target as HTMLInputElement;
  // Convertir a mayúsculas
  input.value = input.value.toUpperCase();
  // Actualizar el valor del formControl para reflejar los cambios
  this.userForm.get('username')?.setValue(input.value, { emitEvent: true });
}

  redirectToList(): void {
    this.router.navigate(['/list-user']);
  }

  get username() {
    return this.userForm.get('username');
  }

  get password() {
    return this.userForm.get('password');
  }

  get role() {
    return this.userForm.get('role');
  }
}