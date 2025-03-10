export interface GroupPaymentContributionDTO {
    id: number;
    clientId: number;
    amountPaid: number;
    contributionDate: string; // Fecha en formato ISO
    paymentMethod: string; // Ej. "EFECTIVO", "PLIN", etc.
  }
  