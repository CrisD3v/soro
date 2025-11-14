/**
 * User API Types
 * Tipos basados en la documentación del backend SORO API
 */

/**
 * Tipos de documento válidos
 */
export type DocumentType = 'CC' | 'CE' | 'TI';

/**
 * Firma del usuario
 */
export interface Signature {
  id: string;
  signature: string; // Base64 data URL
  createdAt: string;
  updatedAt: string;
}

/**
 * Asignación de rol a usuario
 */
export interface RoleAssignment {
  id: string;
  roleId: string;
  companyId: string;
  createdAt: string;
}

/**
 * Usuario completo
 */
export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  fullName: string;
  documentNumber: string;
  documentType: DocumentType;
  phone: string;
  companyId: string;
  roles: RoleAssignment[];
  signature: Signature | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear usuario
 */
export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  lastName: string;
  documentNumber: string;
  documentType: DocumentType;
  phone: string;
  companyId: string;
}

/**
 * DTO para actualizar usuario (todos los campos opcionales)
 */
export interface UpdateUserDto {
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

/**
 * Filtros para listar usuarios
 */
export interface UserFilters {
  companyId?: string;
  email?: string;
  documentNumber?: string;
}

/**
 * DTO para asignar rol a usuario
 */
export interface AssignRoleDto {
  roleId: string;
  companyId: string;
}

/**
 * DTO para asignar firma a usuario
 */
export interface AssignSignatureDto {
  signature: string; // Base64 data URL
}
