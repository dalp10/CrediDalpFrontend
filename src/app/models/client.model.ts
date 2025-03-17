import { Credit } from "./credit.model";
import { Loan } from "./loan.model";

export interface Client {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;  // Número de documento (debe ser validado)
  clientIdentifier?: string;
  hasCredits?: boolean;  // Indica si el cliente tiene créditos asociados
  credit: Credit[],
  loan : Loan[]
}
