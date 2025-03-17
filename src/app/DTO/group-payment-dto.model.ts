import { GroupPaymentContributionDTO } from "./group-payment-contribution-dto.model";
import { PaymentMethod } from "../models/PaymentMethod.model";

export interface GroupPaymentDTO {
  id: number;
  serviceType: string;
  description?: string;
  totalAmount: number;
  paymentDate: string; // Formato ISO
  paymentMethod: PaymentMethod;
  status: string;
  reimbursedAmount: number;
  pendingReimbursement: number;
  payerId: number;
  contributions: GroupPaymentContributionDTO[];
}
