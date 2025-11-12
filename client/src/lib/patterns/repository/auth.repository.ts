/**
 * Repository Pattern para abstracción de datos de autenticación
 * Maneja solo el almacenamiento de userData
 * Los tokens son manejados por el backend en cookies HttpOnly
 */

import type { UserData } from '../../api/auth.types';

const STORAGE_KEYS = {
  USER_DATA: 'soro_user_data',
} as const;

export class AuthRepository {
  /**
   * Guarda los datos del usuario en localStorage
   */
  saveUserData(user: UserData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  /**
   * Obtiene los datos del usuario almacenados
   */
  getUserData(): UserData | null {
    if (typeof window === 'undefined') return null;

    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) return null;

    try {
      return JSON.parse(userData) as UserData;
    } catch {
      return null;
    }
  }

  /**
   * Limpia los datos del usuario
   * Las cookies son limpiadas por el backend en /auth/logout
   */
  clearUserData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Verifica si existe una sesión activa
   * Solo verifica userData, las cookies son verificadas por el middleware
   */
  hasActiveSession(): boolean {
    return this.getUserData() !== null;
  }
}

// Singleton instance
export const authRepository = new AuthRepository();
