'use client';

/**
 * AuthContext - Context mejorado con roles, permisos y multi-tenant
 */

import { authApi } from '@/lib/api/auth.api';
import { userApi } from '@/lib/api/user.api';
import type { User } from '@/lib/api/user.types';
import { authRepository } from '@/lib/patterns/repository/auth.repository';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  currentCompanyId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setCurrentCompanyId: (companyId: string) => void;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permission: string) => boolean;
  canAccessCompany: (companyId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
  const router = useRouter();

  // Verificar si el usuario es OWNER
  const isOwner = user?.roles?.some(
    (roleAssignment) => roleAssignment.roleId === 'owner' // Ajustar según tu implementación
  ) ?? false;

  // Cargar usuario al montar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // Primero intentar obtener el usuario actual desde el backend usando el token
      try {
        console.log('🔍 Attempting to load current user from /auth/me...'); // Debug
        const userData = await authApi.me();
        console.log('✅ UserData from /auth/me:', userData); // Debug

        if (userData && userData.id) {
          // Guardar en localStorage para futuras sesiones
          authRepository.saveUserData(userData);

          // Obtener datos completos del usuario
          try {
            const fullUser = await userApi.getById(userData.id);
            console.log('✅ Full user loaded:', fullUser); // Debug
            setUser(fullUser);
            setCurrentCompanyId(fullUser.companyId);
          } catch (apiError) {
            console.error('⚠️ Error loading full user, using basic data:', apiError);
            // Usar datos básicos como fallback
            const fallbackUser: User = {
              id: userData.id,
              email: userData.email,
              name: userData.name || '',
              lastName: userData.lastName || '',
              fullName: userData.fullName || `${userData.name} ${userData.lastName}`,
              documentNumber: userData.documentNumber || '',
              documentType: userData.documentType || 'CC',
              phone: userData.phone || '',
              companyId: userData.companyId || '',
              roles: [],
              signature: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setUser(fallbackUser);
            setCurrentCompanyId(fallbackUser.companyId);
          }
        }
      } catch (meError) {
        console.log('⚠️ /auth/me failed, trying localStorage...', meError); // Debug

        // Fallback: intentar cargar desde localStorage
        const userData = authRepository.getUserData();
        console.log('🔍 UserData from localStorage:', userData); // Debug

        if (userData && userData.id) {
          try {
            const fullUser = await userApi.getById(userData.id);
            console.log('✅ Full user loaded from localStorage fallback:', fullUser); // Debug
            setUser(fullUser);
            setCurrentCompanyId(fullUser.companyId);
          } catch (apiError) {
            console.error('❌ Both /auth/me and localStorage failed'); // Debug
          }
        } else {
          console.log('ℹ️ No session found - User needs to login'); // Debug
        }
      }
    } catch (error) {
      console.error('❌ Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      authRepository.saveUserData(response.user);

      // Obtener datos completos del usuario
      const fullUser = await userApi.getById(response.user.id);
      setUser(fullUser);
      setCurrentCompanyId(fullUser.companyId);

      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      authRepository.clearUserData();
      setUser(null);
      setCurrentCompanyId(null);
      router.push('/auth');
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const fullUser = await userApi.getById(user.id);
      setUser(fullUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    // Implementar lógica según tu estructura de roles
    return user.roles?.some(
      (roleAssignment) => roleAssignment.roleId.toLowerCase() === roleName.toLowerCase()
    ) ?? false;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    // OWNER tiene todos los permisos
    if (isOwner) return true;

    // Implementar lógica de permisos según tu backend
    // Por ahora retornamos true, deberás ajustar según tu implementación
    return true;
  };

  const canAccessCompany = (companyId: string): boolean => {
    if (!user) return false;
    // OWNER puede acceder a todas las empresas
    if (isOwner) return true;
    // Otros usuarios solo pueden acceder a su empresa
    return user.companyId === companyId;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isOwner,
    currentCompanyId: currentCompanyId || user?.companyId || null,
    login,
    logout,
    refreshUser,
    setCurrentCompanyId,
    hasRole,
    hasPermission,
    canAccessCompany,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
