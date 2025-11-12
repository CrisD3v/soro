/**
 * TanStack Query hooks para autenticación
 */

import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
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
 * Tokens manejados automáticamente en cookies HttpOnly por el backend
 */
export const useLogin = (options?: LoginMutationOptions) => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Solo guardar userData (tokens ya están en cookies)
      authRepository.saveUserData(data.user);
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
 * Backend lee refreshToken de cookie y actualiza cookies automáticamente
 */
export const useRefreshToken = (options?: RefreshTokenMutationOptions) => {
  return useMutation({
    mutationFn: authApi.refreshToken,
    // Backend maneja cookies automáticamente, no hay nada que hacer aquí
    ...options,
  });
};

/**
 * Hook para logout
 * Backend limpia las cookies automáticamente
 */
export const useLogout = (options?: LogoutMutationOptions) => {
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Solo limpiar userData (cookies limpiadas por backend)
      authRepository.clearUserData();
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
