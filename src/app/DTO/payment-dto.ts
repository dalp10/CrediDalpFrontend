// payment-dto.ts
export interface PaymentLoanDTO {
  installmentId: number;         // ID de la cuota del préstamo
  capitalPaid: number;           // Capital pagado
  interestPaid: number;          // Interés pagado
  installmentNumber: number;     // Número de cuota
  paymentMethod: string;         // Medio de pago (efectivo, transferencia, Yape, Plin, etc.)
  paymentDate: string;           // Fecha de pago en formato ISO (YYYY-MM-DD)
  totalPaid: number;             // Monto total pagado
}

export interface PaymentCreditDTO {
  installmentId: number;         // ID de la cuota del crédito
  capitalPaid: number;           // Capital pagado
  interestPaid: number;          // Interés pagado
  installmentNumber: number;     // Número de cuota
  paymentMethod: string;         // Medio de pago (efectivo, transferencia, Yape, Plin, etc.)
  paymentDate: string;           // Fecha de pago en formato ISO (YYYY-MM-DD)
  totalPaid: number;             // Monto total pagado
}
