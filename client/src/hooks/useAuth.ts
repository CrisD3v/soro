/**
 * useAuth Hook - Hook simplificado para acceder al contexto de autenticación
 */

import { useAuthContext } from '@/context/AuthContext';

export function useAuth() {
  return useAuthContext();
}
