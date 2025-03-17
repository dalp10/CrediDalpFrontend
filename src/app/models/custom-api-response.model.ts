// src/app/models/custom-api-response.model.ts
export interface CustomApiResponse<T> {
    statusCode: number; // Código de estado HTTP
    message: string; // Mensaje descriptivo
    data: T; // Datos de la respuesta (puede ser cualquier tipo)
    errors?: ErrorDetail[]; // Lista de errores (opcional)
  }
  
  export interface ErrorDetail {
    field: string; // Campo relacionado con el error
    message: string; // Mensaje de error específico
  }