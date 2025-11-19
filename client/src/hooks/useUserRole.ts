/**
 * useUserRole - Hook para obtener el nombre del rol del usuario
 */

import { useRole } from '@/lib/queries/role.queries';
import { useAuth } from './useAuth';

export function useUserRole() {
  const { user } = useAuth();

  // Obtener el primer rol del usuario
  const firstRoleId = user?.roles?.[0]?.roleId;

  // Obtener datos completos del rol
  const { data: role, isLoading } = useRole(firstRoleId || '', {
    enabled: !!firstRoleId,
  });

  return {
    roleName: role?.name || 'Usuario',
    roleId: firstRoleId,
    role,
    isLoading,
  };
}
