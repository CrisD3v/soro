/**
 * Company Utilities - Funciones para filtrado multi-tenant
 */

import type { User } from '@/lib/api/user.types';

/**
 * Verifica si un usuario es OWNER (puede ver todas las empresas)
 */
export function isOwner(user: User | null): boolean {
  if (!user) return false;
  return user.roles?.some(
    (roleAssignment) => roleAssignment.roleId.toLowerCase() === 'owner'
  ) ?? false;
}

/**
 * Obtiene el filtro de companyId para queries
 * - Si es OWNER: retorna undefined (ve todas las empresas)
 * - Si no es OWNER: retorna su companyId
 */
export function getCompanyFilter(user: User | null, selectedCompanyId?: string): string | undefined {
  if (!user) return undefined;

  // Si es OWNER, puede seleccionar empresa o ver todas
  if (isOwner(user)) {
    return selectedCompanyId; // undefined = todas las empresas
  }

  // Usuarios normales solo ven su empresa
  return user.companyId;
}

/**
 * Verifica si un usuario puede acceder a datos de una empresa específica
 */
export function canAccessCompany(user: User | null, companyId: string): boolean {
  if (!user) return false;

  // OWNER puede acceder a todas las empresas
  if (isOwner(user)) return true;

  // Otros usuarios solo pueden acceder a su empresa
  return user.companyId === companyId;
}

/**
 * Obtiene el companyId efectivo para operaciones
 * - Si es OWNER y tiene empresa seleccionada: usa la seleccionada
 * - Si no: usa la empresa del usuario
 */
export function getEffectiveCompanyId(user: User | null, selectedCompanyId?: string): string | undefined {
  if (!user) return undefined;

  if (isOwner(user) && selectedCompanyId) {
    return selectedCompanyId;
  }

  return user.companyId;
}
