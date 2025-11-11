/**
 * Types comunes y compartidos en toda la aplicación
 */

// HTTP Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  statusCode: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Theme types
export type Theme = 'light' | 'dark';

// Document types según API
export type DocumentType = 'CC' | 'CE' | 'TI';

// Status types
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
