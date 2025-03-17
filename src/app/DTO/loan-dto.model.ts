// loan-dto.model.ts
export interface LoanDTO {
    id: number;
    amount: number;  // Capital original del préstamo
    interestRate: number;  // Tasa de interés (en porcentaje)
    issueDate: string;  // Fecha de emisión del préstamo
    dueDate?: string;  // Fecha de vencimiento (opcional)
    clientId: number;  // ID del cliente asociado
    loanCode: string;  // Código único del préstamo
    interestAmount: number;  // Interés calculado original
    totalAmount: number;  // Deuda pendiente total
    status: 'PENDING' | 'APPROVED' | 'REJECTED';  // Estado del préstamo
    daysOverdue?: number;  // Días de atraso (opcional)
    interestPaid: number;  // Monto del interés ya pagado
    capitalPaid: number;  // Monto del capital ya pagado
    remainingCapital: number;  // Capital pendiente de pago
    remainingInterest: number;  // Interés pendiente de pago
  }