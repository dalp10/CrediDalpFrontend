import { Client } from './client.model';

export interface Credit {
  id?: number;
  capitalAmount: number;
  code?: string; // Código único del crédito (ejemplo: CRE-001)
  startDate: string;
  gracePeriodDays: number;
  clientId : number,
  client: Client;
  status: CreditStatus;
  numberOfInstallments?: number; // Agregado
  tea?: number; // Agregado
  firstPaymentDate?: Date; // Agregado
  installmentNumber? : number
}

  
  export enum CreditStatus {
    ACTIVE = 'ACTIVE',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED'
  }