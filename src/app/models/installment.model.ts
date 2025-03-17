import { InstallmentStatus } from "../enum/installment-status";

export interface Installment {
    id: number;
    installmentNumber: number; // Asegúrate de que esta propiedad exista
    dueDate: Date;
    amount: number;
    capitalAmount: number;
    interestAmount: number;
    status: InstallmentStatus;
    creditId: number;
  }
