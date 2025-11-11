/**
 * TanStack Query hooks para autenticación
 */

import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { ApiClientFactory } from '../patterns/factory/api-client.factory';
import { authRepository } from '../patterns/repository/auth.repository';
import type {
  LoginMutationOptions,
  LogoutMutationOptions,
  RefreshTokenMutationOptions,
  RegisterMutationOptions,
  ResetPasswordMutationOptions,
} from './auth.queries.types';

/**
 * Hook para login
 */
export const useLogin = (options?: LoginMutationOptions) => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Guardar sesión en localStorage
      authRepository.saveSession(data);
      // Configurar token en API client
      ApiClientFactory.setAuthToken(data.accessToken);
    },
    ...options,
  });
};

/**
 * Hook para registro
 */
export const useRegister = (options?: RegisterMutationOptions) => {
  return useMutation({
    mutationFn: authApi.register,
    ...options,
  });
};

/**
 * Hook para refresh token
 */
export const useRefreshToken = (options?: RefreshTokenMutationOptions) => {
  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      // Actualizar tokens en localStorage
      authRepository.updateTokens(data.accessToken, data.refreshToken);
      // Actualizar token en API client
      ApiClientFactory.setAuthToken(data.accessToken);
    },
    ...options,
  });
};

/**
 * Hook para logout
 */
export const useLogout = (options?: LogoutMutationOptions) => {
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Limpiar sesión
      authRepository.clearSession();
      // Limpiar token del API client
      ApiClientFactory.setAuthToken(null);
    },
    ...options,
  });
};

/**
 * Hook para reset password
 */
export const useResetPassword = (options?: ResetPasswordMutationOptions) => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    ...options,
  });
};
