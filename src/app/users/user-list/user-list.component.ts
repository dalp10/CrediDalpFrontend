import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [RouterModule, FormsModule, CommonModule],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  showDeleteConfirmation = false; // Controla la visibilidad del mensaje de confirmación
  userIdToDelete: number | null = null; // Almacena el ID del usuario a eliminar

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Carga la lista de usuarios
  loadUsers() {
    this.userService.getUsers().subscribe((users) => (this.users = users));
  }

  // Muestra el mensaje de confirmación para eliminar un usuario
  deleteUser(userId: number | undefined): void {
    if (userId !== undefined) {
      this.userIdToDelete = userId; // Almacena el ID del usuario a eliminar
      this.showDeleteConfirmation = true; // Muestra el modal de confirmación
    } else {
      console.error('User ID is undefined');
    }
  }
  

  // Confirma la eliminación del usuario
  confirmDelete() {
    if (this.userIdToDelete !== null) {
      this.userService.deleteUser(this.userIdToDelete).subscribe(() => {
        this.loadUsers(); // Recarga la lista de usuarios después de eliminar
        this.showDeleteConfirmation = false; // Oculta el mensaje de confirmación
      });
    }
  }

  // Cancela la eliminación del usuario
  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.userIdToDelete = null;
  }
}