import { Permission, Role } from '../entities/role.entity';

export interface CreateRoleData {
  name: string;
}

export interface UpdateRoleData {
  name?: string;
}

export interface AssignPermissionData {
  roleId: string;
  permissionId: string;
}

export abstract class RoleRepositoryPort {
  abstract create(data: CreateRoleData): Promise<Role>;
  abstract findById(id: string): Promise<Role | null>;
  abstract findByName(name: string): Promise<Role | null>;
  abstract update(id: string, data: UpdateRoleData): Promise<Role>;
  abstract delete(id: string): Promise<void>;
  abstract list(): Promise<Role[]>;
  abstract assignPermission(data: AssignPermissionData): Promise<void>;
  abstract removePermission(
    roleId: string,
    permissionId: string,
  ): Promise<void>;
  abstract getPermissions(roleId: string): Promise<Permission[]>;
  abstract hasPermission(
    roleId: string,
    permissionId: string,
  ): Promise<boolean>;
}
