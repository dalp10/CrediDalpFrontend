import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomApiResponse } from '../../models/custom-api-response.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../shared/modals/confirmation-modal/confirmation-modal.component';
import { ResponseModalComponent } from '../../shared/modals/response-modal/response-modal.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [RouterModule, CommonModule, MatTableModule, MatButtonModule, MatIconModule],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['username', 'role', 'actions'];

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Carga la lista de usuarios
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (response: CustomApiResponse<User[]>) => {
        this.users = response.data;
      },
      error: (err) => {
        console.error('Error al cargar los usuarios:', err);
        this.showResponseModal('Error loading users. Please try again later.');
      },
    });
  }

  // Abre el modal de confirmación para eliminar un usuario
  deleteUser(userId: number | undefined): void {
    if (userId !== undefined) {
      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        data: { message: 'Are you sure you want to delete this user?' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.userService.deleteUser(userId).subscribe({
            next: () => {
              this.loadUsers(); // Recarga la lista de usuarios después de eliminar
              this.showResponseModal('User deleted successfully.');
            },
            error: (err) => {
              console.error('Error deleting user:', err);
              this.showResponseModal('Error deleting user. Please try again later.');
            },
          });
        }
      });
    } else {
      console.error('User ID is undefined');
    }
  }

  // Muestra el modal de respuesta con un mensaje
  showResponseModal(message: string): void {
    this.dialog.open(ResponseModalComponent, {
      data: { message },
    });
  }
}