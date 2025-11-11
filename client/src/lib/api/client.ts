/**
 * Cliente HTTP base para consumir la API
 * Implementa interceptors para manejo de tokens y errores
 */

import type { ApiError } from '../types/common.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Establece el access token para requests autenticados
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  /**
   * Obtiene el access token actual
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Realiza un request HTTP con manejo de errores
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, headers = {}, ...restConfig } = config;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    // Agregar token si es requerido
    if (requiresAuth && this.accessToken) {
      requestHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...restConfig,
        headers: requestHeaders,
      });

      // Manejar respuestas sin contenido (204)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = data;
        throw error;
      }

      return data as T;
    } catch (error) {
      // Re-lanzar errores de API
      if (this.isApiError(error)) {
        throw error;
      }

      // Manejar errores de red u otros
      throw {
        statusCode: 500,
        message: 'Network error or server unavailable',
        error: 'Internal Server Error',
      } as ApiError;
    }
  }

  /**
   * Type guard para verificar si es un error de API
   */
  private isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      'message' in error &&
      'error' in error
    );
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
