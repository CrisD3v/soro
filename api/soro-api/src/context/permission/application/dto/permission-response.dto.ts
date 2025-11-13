import { Permission } from '@context/permission/domain/entities/permission.entity';
import { PermissionScope } from '@prisma/client';

export class PermissionResponseDto {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  scope: PermissionScope;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(permission: Permission): PermissionResponseDto {
    const dto = new PermissionResponseDto();
    dto.id = permission.id;
    dto.name = permission.name;
    dto.description = permission.description;
    dto.resource = permission.resource;
    dto.action = permission.action;
    dto.scope = permission.scope;
    dto.createdAt = permission.createdAt!;
    dto.updatedAt = permission.updatedAt!;
    return dto;
  }
}
