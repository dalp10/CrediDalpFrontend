export interface Credit {
  id?: number;
  capitalAmount: number;
  //interestRate: number;
  startDate: string;
  //endDate: string;
  gracePeriodDays: number;
  clientId: number;
  status: CreditStatus;
  numberOfInstallments?: number; // Agregado
  tea?: number; // Agregado
  firstPaymentDate?: Date; // Agregado
}

  
  export enum CreditStatus {
    ACTIVE = 'ACTIVE',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED'
  }