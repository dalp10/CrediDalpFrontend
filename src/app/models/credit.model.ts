import { Client } from './client.model';
import { CreditStatus } from '../enum/credit-status.model';

export interface Credit {
  id?: number;
  capitalAmount: number;
  code?: string; // Código único del crédito (ejemplo: CRE-001)
  startDate: string;
  gracePeriodDays: number;
  clientId : number,
  client: Client | null;
  status: CreditStatus;
  numberOfInstallments?: number; // Agregado
  tea?: number; // Agregado
  firstPaymentDate?: string; // Agregado
  installmentNumber? : number
}

