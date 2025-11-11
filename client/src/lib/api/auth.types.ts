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
  accessToken: string;
  refreshToken: string;
  user: UserData;
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
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Logout types
export interface LogoutRequest {
  refreshToken: string;
}

// Reset password types
export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
}
