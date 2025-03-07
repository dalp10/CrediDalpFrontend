export interface Loan {
  id: number;
  amount: number;  // Monto del préstamo
  interestRate: number;  // Tasa de interés
  issueDate: string;  // Fecha de emisión del préstamo (en formato ISO 8601)
  dueDate?: string;  // Fecha de vencimiento (opcional)
  clientId: number;  // ID del cliente asociado al préstamo
  loanCode: string;  // Código único para el préstamo
  interestAmount: number;  // Monto del interés calculado
  totalAmount: number;  // Monto total (monto del préstamo + monto del interés)
  status: 'PENDING' | 'APPROVED' | 'REJECTED';  // Estado del préstamo (PENDING por defecto)
}