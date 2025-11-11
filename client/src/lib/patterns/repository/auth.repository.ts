/**
 * Repository Pattern para abstracción de datos de autenticación
 * Maneja el almacenamiento local de tokens y estado de sesión
 */

import type { LoginResponse, UserData } from '../../api/auth.types';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'soro_access_token',
  REFRESH_TOKEN: 'soro_refresh_token',
  USER_DATA: 'soro_user_data',
} as const;

export class AuthRepository {
  /**
   * Guarda los datos de sesión en localStorage
   */
  saveSession(loginResponse: LoginResponse): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, loginResponse.accessToken);
    localStorage.setItem(
      STORAGE_KEYS.REFRESH_TOKEN,
      loginResponse.refreshToken
    );
    localStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(loginResponse.user)
    );
  }

  /**
   * Obtiene el access token almacenado
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Obtiene el refresh token almacenado
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
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
   * Actualiza solo el access token
   */
  updateAccessToken(accessToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  }

  /**
   * Actualiza ambos tokens
   */
  updateTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  /**
   * Limpia toda la sesión
   */
  clearSession(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Verifica si existe una sesión activa
   */
  hasActiveSession(): boolean {
    return this.getAccessToken() !== null && this.getUserData() !== null;
  }
}

// Singleton instance
export const authRepository = new AuthRepository();
