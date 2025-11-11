import { User } from '../entities/user.entity';

import { typeDocument } from '@prisma/client';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  lastName: string;
  documentNumber: string;
  documentType: typeDocument;
  phone: string;
  companyId: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  lastName?: string;
  phone?: string;
  password?: string;
}

export interface AssignRoleData {
  userId: string;
  roleId: string;
  companyId: string;
}

export interface AssignSignatureData {
  userId: string;
  signature: string;
}

export interface ListUsersFilters {
  companyId?: string;
  email?: string;
  documentNumber?: string;
}

export abstract class UserRepositoryPort {
  abstract create(data: CreateUserData): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByDocumentNumber(documentNumber: string): Promise<User | null>;
  abstract update(id: string, data: UpdateUserData): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract list(filters?: ListUsersFilters): Promise<User[]>;
  abstract assignRole(data: AssignRoleData): Promise<void>;
  abstract removeRole(userId: string, roleId: string, companyId: string): Promise<void>;
  abstract assignSignature(data: AssignSignatureData): Promise<void>;
  abstract updateSignature(userId: string, signature: string): Promise<void>;
}
