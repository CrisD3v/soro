/**
 * Hook para manejar el estado de autenticación
 */

'use client';

import type { UserData } from '@/lib/api/auth.types';
import { authRepository } from '@/lib/patterns/repository/auth.repository';
import { useEffect, useState } from 'react';
import type { UseAuthReturn } from './useAuth.types';

/**
 * Hook para acceder al estado de autenticación
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario desde localStorage
    const userData = authRepository.getUserData();

    if (userData) {
      setUser(userData);
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    authRepository.clearUserData();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    logout,
  };
};
