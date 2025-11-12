/**
 * Types para el módulo de autenticación
 */

import type { DocumentType } from '../types/common.types';

// Login types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserData;
  // Tokens enviados en cookies HttpOnly por el backend
}

// Register types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  lastName: string;
  documentNumber: string;
  documentType: DocumentType;
  phone: string;
  companyId: string;
}

// User data
export interface UserData {
  id: string;
  email: string;
  name: string;
  lastName: string;
  fullName?: string;
  documentNumber?: string;
  documentType?: DocumentType;
  phone?: string;
  companyId?: string;
}

// Refresh token types
export interface RefreshTokenRequest {
  // RefreshToken enviado automáticamente en cookie
}

export interface RefreshTokenResponse {
  message: string;
  // Tokens actualizados en cookies HttpOnly por el backend
}

// Logout types
export interface LogoutRequest {
  // RefreshToken enviado automáticamente en cookie
}

// Reset password types
export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
}
