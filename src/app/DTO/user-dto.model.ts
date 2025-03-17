// user-dto.model.ts
import { RoleDTO } from './role-dto.model';

export interface UserDTO {
  id?: number;
  username: string;
  password?: string;  // La contraseña puede ser opcional en algunos casos
  role: RoleDTO;  // Rol del usuario
}