import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationModalComponent } from '../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ResponseModalComponent } from '../../shared/modals/response-modal/response-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomApiResponse } from '../../models/custom-api-response.model';


@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup;
  roles: Role[] = [];
  isLoading = false;
  userExists = false;
  backendMessage: string | null = null;
  isSuccess: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, this.validateUsername]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.setupUsernameValidation();
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles: CustomApiResponse<Role[]>) => {
        this.roles = roles.data;
      },
      error: (err) => {
        console.error('Error al cargar los roles:', err);
      },
    });
  }

  setupUsernameValidation(): void {
    this.userForm.get('username')?.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((username) => this.userService.checkUsernameExists(username))
      )
      .subscribe({
        next: (existsResponse: CustomApiResponse<boolean>) => {
          this.userExists = existsResponse.data;
        },
        error: (err) => {
          console.error('Error al verificar el nombre de usuario:', err);
        },
      });
  }

  onSubmit(): void {
    if (this.userForm.invalid || this.userExists) {
      this.userForm.markAllAsTouched();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { message: '¿Estás seguro de que deseas crear este usuario?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createUser();
      }
    });
  }

  createUser(): void {
    this.isLoading = true;

    const formValue = this.userForm.value;
    const role = this.roles.find((r) => r.id === Number(formValue.role));

    if (!role) {
      console.error('El rol seleccionado no es válido:', formValue.role);
      this.snackBar.open('El rol seleccionado no es válido.', 'Cerrar', { duration: 3000 });
      this.isLoading = false;
      return;
    }

    const newUser = new User(formValue.username, formValue.password, role);
    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.isLoading = false;
        this.backendMessage = 'Usuario creado exitosamente';
        this.isSuccess = true;
        this.showResponseModal();
      },
      error: (error) => {
        this.isLoading = false;
        this.backendMessage = 'Error al crear el usuario: ' + error.message;
        this.isSuccess = false;
        this.showResponseModal();
      },
    });
  }

  showResponseModal(): void {
    const dialogRef = this.dialog.open(ResponseModalComponent, {
      data: { message: this.backendMessage },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.isSuccess) {
        this.router.navigate(['/list-user']);
      }
    });
  }

  validateUsername(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const onlyLetters = /^[A-Z]+$/.test(value);
    const isFourCharacters = value.length === 4;

    if (!onlyLetters || !isFourCharacters) {
      return { invalidUsername: true };
    }

    return null;
  }

  convertToUppercase(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.userForm.get('username')?.setValue(input.value, { emitEvent: true });
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