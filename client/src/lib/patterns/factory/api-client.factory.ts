/**
 * Factory Pattern para crear instancias de API clients
 */

import { apiClient } from '../../api/client';

type ApiClientType = 'auth' | 'users' | 'companies' | 'roles';

interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
}

/**
 * Factory para crear y configurar API clients
 */
export class ApiClientFactory {
  private static instances: Map<ApiClientType, typeof apiClient> = new Map();

  /**
   * Obtiene o crea una instancia de API client
   */
  static getClient(
    type: ApiClientType,
    config?: ApiClientConfig
  ): typeof apiClient {
    if (!this.instances.has(type)) {
      // Por ahora usamos el mismo cliente para todos
      // En el futuro se pueden crear clientes especializados
      this.instances.set(type, apiClient);
    }

    return this.instances.get(type)!;
  }

  /**
   * Limpia todas las instancias
   */
  static clearInstances(): void {
    this.instances.clear();
  }

  /**
   * Configura el token de autenticación para todos los clientes
   * @deprecated Tokens ahora manejados en cookies HttpOnly por el backend
   */
  static setAuthToken(token: string | null): void {
    // No-op: Tokens manejados en cookies
    console.warn('[ApiClientFactory] setAuthToken is deprecated. Tokens are now handled in HttpOnly cookies.');
  }
}
