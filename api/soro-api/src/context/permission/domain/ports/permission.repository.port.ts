import { PermissionScope } from '@prisma/client';
import { Permission } from '../entities/permission.entity';

export interface CreatePermissionData {
  name: string;
  description?: string;
  resource: string;
  action: string;
  scope: PermissionScope;
}

export interface UpdatePermissionData {
  name?: string;
  description?: string;
}

export interface ListPermissionsFilters {
  resource?: string;
  action?: string;
  scope?: PermissionScope;
}

export abstract class PermissionRepositoryPort {
  abstract create(data: CreatePermissionData): Promise<Permission>;
  abstract findById(id: string): Promise<Permission | null>;
  abstract findByName(name: string): Promise<Permission | null>;
  abstract update(id: string, data: UpdatePermissionData): Promise<Permission>;
  abstract delete(id: string): Promise<void>;
  abstract list(filters?: ListPermissionsFilters): Promise<Permission[]>;
}
