'use client';

/**
 * ProtectedRoute - HOC para proteger rutas que requieren autenticación
 */

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOwner?: boolean;
  requireRole?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requireOwner = false,
  requireRole,
  fallback = <div>Loading...</div>,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isOwner, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Verificar si requiere ser OWNER
  if (requireOwner && !isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need OWNER role to access this page.</p>
        </div>
      </div>
    );
  }

  // Verificar si requiere un rol específico
  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need {requireRole} role to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
