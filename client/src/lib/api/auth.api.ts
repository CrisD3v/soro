/**
 * API endpoints para autenticación
 */

import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UserData,
} from './auth.types';
import { apiClient } from './client';

export const authApi = {
  /**
   * Login - Obtener tokens de acceso
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  /**
   * Register - Crear nuevo usuario
   */
  register: async (userData: RegisterRequest): Promise<UserData> => {
    return apiClient.post<UserData>('/users', userData);
  },

  /**
   * Refresh Token - Renovar access token
   */
  refreshToken: async (
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', request);
  },

  /**
   * Logout - Cerrar sesión
   */
  logout: async (request: LogoutRequest): Promise<void> => {
    return apiClient.post<void>('/auth/logout', request, {
      requiresAuth: true,
    });
  },

  /**
   * Reset Password - Solicitar cambio de contraseña
   */
  resetPassword: async (
    request: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    return apiClient.post<ResetPasswordResponse>(
      '/auth/reset-password',
      request
    );
  },
};
