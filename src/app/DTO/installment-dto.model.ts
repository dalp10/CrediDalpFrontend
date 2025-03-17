// installment-dto.model.ts
export interface InstallmentDTO {
    id: number;
    installmentNumber: number;  // Número de la cuota
    dueDate: Date;  // Fecha de vencimiento
    amount: number;  // Monto total de la cuota
    capitalAmount: number;  // Monto del capital
    interestAmount: number;  // Monto del interés
    status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIALLY_PAID';  // Estado de la cuota
    creditId: number;  // ID del crédito asociado
  }