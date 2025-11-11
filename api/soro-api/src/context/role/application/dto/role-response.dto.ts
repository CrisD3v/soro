import { Permission, Role } from '@context/role/domain/entities/role.entity';

export class PermissionResponseDto {
  id: string;
  name: string;
  description: string | null;

  static fromEntity(permission: Permission): PermissionResponseDto {
    const dto = new PermissionResponseDto();
    dto.id = permission.id;
    dto.name = permission.name;
    dto.description = permission.description;
    return dto;
  }
}

export class RoleResponseDto {
  id: string;
  name: string;
  permissions?: PermissionResponseDto[];
  permissionCount: number;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(role: Role): RoleResponseDto {
    const dto = new RoleResponseDto();
    dto.id = role.id;
    dto.name = role.name;
    dto.permissionCount = role.permissionCount;
    dto.createdAt = role.createdAt!;
    dto.updatedAt = role.updatedAt!;

    if (role.permissions) {
      dto.permissions = role.permissions.map((p) =>
        PermissionResponseDto.fromEntity(p),
      );
    }

    return dto;
  }
}
