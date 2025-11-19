'use client';

/**
 * CanAccess - Componente condicional para mostrar contenido según permisos
 */

import { useAuth } from '@/hooks/useAuth';

interface CanAccessProps {
  children: React.ReactNode;
  permission?: string;
  role?: string;
  requireOwner?: boolean;
  companyId?: string;
  fallback?: React.ReactNode;
}

export function CanAccess({
  children,
  permission,
  role,
  requireOwner = false,
  companyId,
  fallback = null,
}: CanAccessProps) {
  const { isOwner, hasRole, hasPermission, canAccessCompany } = useAuth();

  // Verificar OWNER
  if (requireOwner && !isOwner) {
    return <>{fallback}</>;
  }

  // Verificar rol
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  // Verificar permiso
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Verificar acceso a empresa
  if (companyId && !canAccessCompany(companyId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
