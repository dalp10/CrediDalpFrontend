// credit-dto.model.ts
import { ClientDTO } from "./client-dto.model";
import { InstallmentDTO } from './installment-dto.model'

export interface CreditDTO {
  id?: number;
  capitalAmount: number;
  code?: string;  // Código único del crédito
  startDate: string;
  gracePeriodDays: number;
  clientId: number;
  client?: ClientDTO;  // Cliente asociado (opcional)
  status: 'ACTIVO' | 'PAGADO' | 'VENCIDO' | 'CANCELADO';
  numberOfInstallments?: number;  // Número de cuotas
  tea?: number;  // Tasa de interés efectiva anual
  firstPaymentDate?: Date;  // Fecha del primer pago
  installments?: InstallmentDTO[];  // Lista de cuotas (opcional)
}