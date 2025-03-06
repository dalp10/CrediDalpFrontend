import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faUserTag, faSave, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
declare var bootstrap: any; // Importar Bootstrap para manipular modales

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, ReactiveFormsModule],
})
export class UserEditComponent implements OnInit {
  user: User = new User('', '', new Role(0, ''));
  roles: Role[] = [];
  private confirmModal: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    library.add(faUser, faUserTag, faSave, faTimes, faCheck); // Agrega los iconos que vas a usar
  }

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!userId || isNaN(userId)) {
      console.error('Invalid user ID');
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (userData) => {
        if (userData) {
          this.user = new User(userData.username, userData.password, new Role(userData.role.id, userData.role.name));
          this.user.id = userData.id;
        } else {
          console.error('User not found');
        }
      },
      error: (error) => {
        console.error('Error loading user:', error);
      },
    });

    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      },
    });

    // Inicializar el modal
    this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
  }

  confirmSave(): void {
    if (!this.user.role || !this.user.role.id) {
      alert('Please select a valid role before saving.');
      return;
    }
    this.confirmModal.show();
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.user || this.user.id === undefined) {
      console.error('User or user ID is not defined');
      return;
    }

    // Asegurar que el objeto `Role` esté bien referenciado
    const selectedRole = this.roles.find(role => role.id === this.user.role.id);
    if (selectedRole) {
      this.user.role = selectedRole;
    }

    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        this.router.navigate(['/list-user']);
      },
      error: (error) => {
        console.error('Error updating user:', error);
        alert('Ocurrió un error al actualizar el usuario. Por favor, intenta de nuevo.');
      },
    });

    // Cerrar el modal después de confirmar
    this.confirmModal.hide();
  }
}
