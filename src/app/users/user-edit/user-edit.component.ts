import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationModalComponent } from '../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ResponseModalComponent } from '../../shared/modals/response-modal/response-modal.component';
import { CustomApiResponse } from '../../models/custom-api-response.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
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
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  user: User = new User('', '', new Role(0, ''));
  roles: Role[] = [];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!userId || isNaN(userId)) {
      console.error('Invalid user ID');
      this.snackBar.open('Invalid user ID', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loadUser(userId);
    this.loadRoles();
  }

  loadUser(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (userData: CustomApiResponse<User>) => {
        if (userData.data) {
          this.user = new User(
            userData.data.username,
            userData.data.password,
            new Role(userData.data.role.id, userData.data.role.name)
          );
          this.user.id = userData.data.id;
          this.userForm.patchValue({
            username: this.user.username,
            role: this.user.role.id,
          });
        } else {
          this.showResponseModal('User not found', false);
        }
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.showResponseModal('Error loading user', false);
      },
    });
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles: CustomApiResponse<Role[]>) => {
        this.roles = roles.data;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.showResponseModal('Error loading roles', false);
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { message: 'Are you sure you want to save the changes?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveUser();
      }
    });
  }

  saveUser(): void {
    const formValue = this.userForm.value;
    const selectedRole = this.roles.find((role) => role.id === formValue.role);

    if (!selectedRole) {
      this.showResponseModal('Invalid role selected', false);
      return;
    }

    this.user.role = selectedRole;

    if (this.user.id === undefined) {
      this.showResponseModal('User ID is not defined', false);
      return;
    }

    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: (response: CustomApiResponse<User>) => {
        this.showResponseModal('User updated successfully', true);
        this.router.navigate(['/list-user']);
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.showResponseModal('Error updating user', false);
      },
    });
  }

  showResponseModal(message: string, isSuccess: boolean): void {
    const dialogRef = this.dialog.open(ResponseModalComponent, {
      data: { message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (isSuccess) {
        this.router.navigate(['/list-user']);
      }
    });
  }
}