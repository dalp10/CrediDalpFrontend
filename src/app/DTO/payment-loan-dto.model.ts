// payment-loan-dto.model.ts
import { PaymentMethod } from './PaymentMethod.model';

export interface PaymentLoanDTO {
  loanId: number;  // ID del préstamo asociado
  amount: number;  // Monto del pago
  paymentDate: Date;  // Fecha del pago
  paymentMethod: PaymentMethod;  // Método de pago (EFECTIVO, TRANSFERENCIA, etc.)
}