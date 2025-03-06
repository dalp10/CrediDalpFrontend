export interface Client {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;  // Número de documento (debe ser validado)
  clientIdentifier?: string;
}
