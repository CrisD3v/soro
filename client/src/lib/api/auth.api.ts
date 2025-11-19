/**
 * API endpoints para autenticación
 */

import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UserData
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
   * Get Current User - Obtener usuario autenticado actual
   * Usa el accessToken de la cookie para obtener el usuario
   */
  me: async (): Promise<UserData> => {
    return apiClient.get<UserData>('/auth/me', {
      requiresAuth: true,
    });
  },

  /**
   * Register - Crear nuevo usuario
   */
  register: async (userData: RegisterRequest): Promise<UserData> => {
    return apiClient.post<UserData>('/users', userData);
  },

  /**
   * Refresh Token - Renovar access token
   * RefreshToken enviado automáticamente en cookie
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', {});
  },

  /**
   * Logout - Cerrar sesión
   * RefreshToken enviado automáticamente en cookie
   */
  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout', {}, {
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
