export interface Loan {
  id: number;
  amount: number;           // Capital original del préstamo
  interestRate: number;     // Tasa de interés (en porcentaje) original
  issueDate: string;        // Fecha de emisión del préstamo (ISO 8601)
  dueDate?: string;         // Fecha de vencimiento (opcional)
  clientId: number;         // ID del cliente asociado
  loanCode: string;         // Código único del préstamo
  interestAmount: number;   // Interés calculado original (valor fijo)
  totalAmount: number;      // Deuda pendiente total (remainingCapital + remainingInterest)
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Estado del préstamo
  daysOverdue?: number;     // Días de atraso (opcional)
  interestPaid: number;     // Monto del interés ya pagado acumulado
  capitalPaid: number;      // Monto del capital ya pagado acumulado
  remainingCapital: number; // Capital pendiente de pago
  remainingInterest: number;// Interés pendiente de pago
  //payments?: any[];       // (opcional) Lista de pagos realizados
}
