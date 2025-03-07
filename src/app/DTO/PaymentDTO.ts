export interface PaymentDTO {
  installmentId: number; // ID de la cuota
  capitalPaid: number; // Capital pagado
  interestPaid: number; // Interés pagado
  installmentNumber: number; // Número de cuota
  paymentMethod: string; // Medio de pago (efectivo, transferencia, Yape, Plin)
  paymentDate: string; // Fecha de pago (formato ISO: 'YYYY-MM-DD')
  totalPaid: number; // Monto total pagado
}