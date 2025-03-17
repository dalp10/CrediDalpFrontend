// payment-credit-dto.model.ts

export interface PaymentCreditDTO {
  creditId: number;               // ID del crédito asociado
  installmentId: number;          // ID de la cuota
  installmentNumber: number;      // Número de cuota (obligatorio)
  paymentMethod: string;          // Método de pago
  paymentDate: string;            // Fecha de pago
  capitalPaid: number;            // Monto de capital pagado
  interestPaid: number;           // Monto de interés pagado
  totalPaid: number;              // Monto total pagado
}
