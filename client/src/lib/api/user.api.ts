/**
 * User API Client
 * Cliente para interactuar con los endpoints de usuarios del backend
 */

import { apiClient } from './client';
import type {
  AssignRoleDto,
  AssignSignatureDto,
  CreateUserDto,
  UpdateUserDto,
  User,
  UserFilters,
} from './user.types';

/**
 * API de usuarios
 */
export const userApi = {
  /**
   * Obtener todos los usuarios
   * GET /users
   */
  getAll: async (filters?: UserFilters): Promise<User[]> => {
    const params = new URLSearchParams();

    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.email) params.append('email', filters.email);
    if (filters?.documentNumber) params.append('documentNumber', filters.documentNumber);

    const queryString = params.toString();
    const url = queryString ? `/users?${queryString}` : '/users';

    return apiClient.get<User[]>(url);
  },

  /**
   * Obtener un usuario por ID
   * GET /users/:id
   */
  getById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`);
  },

  /**
   * Crear un nuevo usuario
   * POST /users
   */
  create: async (data: CreateUserDto): Promise<User> => {
    return apiClient.post<User>('/users', data);
  },

  /**
   * Actualizar un usuario
   * PUT /users/:id
   */
  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    return apiClient.put<User>(`/users/${id}`, data);
  },

  /**
   * Asignar rol a un usuario
   * POST /users/:id/roles
   */
  assignRole: async (id: string, data: AssignRoleDto): Promise<void> => {
    return apiClient.post<void>(`/users/${id}/roles`, data);
  },

  /**
   * Asignar firma a un usuario
   * POST /users/:id/signature
   */
  assignSignature: async (id: string, data: AssignSignatureDto): Promise<void> => {
    return apiClient.post<void>(`/users/${id}/signature`, data);
  },
};
