export interface Installment {
    id: number;
    dueDate: Date;
    amount: number;
    capitalAmount: number;
    interestAmount: number;
    status: InstallmentStatus;
    creditId: number;
  }
  
  export enum InstallmentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE'
  }