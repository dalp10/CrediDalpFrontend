// client-dto.model.ts
import { CreditDTO } from './credit-dto.model';
import { LoanDTO } from './loan-dto.model';

export interface ClientDTO {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;  // Número de documento
  clientIdentifier?: string;
  hasCredits?: boolean;  // Indica si el cliente tiene créditos asociados
  credits?: CreditDTO[];  // Lista de créditos asociados (opcional)
  loans?: LoanDTO[];  // Lista de préstamos asociados (opcional)
}