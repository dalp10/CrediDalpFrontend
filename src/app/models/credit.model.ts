export interface Credit {
  id?: number; // id es opcional
  capitalAmount: number;
  interestRate: number;
  startDate: Date;
  endDate: Date;
  gracePeriodDays: number;
  clientId: number;
  status: CreditStatus;
}
  
  export enum CreditStatus {
    ACTIVE = 'ACTIVE',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED'
  }