import { Permission, Role } from '@context/role/domain/entities/role.entity';
import {
  Permission as PrismaPermission,
  Role as PrismaRole,
  RolePermission,
} from '@prisma/client';

type PrismaRoleWithRelations = PrismaRole & {
  permissions?: (RolePermission & {
    permission: PrismaPermission;
  })[];
};

export class RoleMapper {
  static toDomain(prismaRole: PrismaRoleWithRelations): Role {
    const permissions: Permission[] | undefined = prismaRole.permissions?.map(
      (rp) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description,
      }),
    );

    return new Role(
      prismaRole.id,
      prismaRole.name,
      permissions,
      prismaRole.createdAt,
      prismaRole.updatedAt,
    );
  }

  static toDomainList(prismaRoles: PrismaRoleWithRelations[]): Role[] {
    return prismaRoles.map((role) => this.toDomain(role));
  }

  static permissionToDomain(prismaPermission: PrismaPermission): Permission {
    return {
      id: prismaPermission.id,
      name: prismaPermission.name,
      description: prismaPermission.description,
    };
  }

  static permissionsToDomain(
    prismaPermissions: PrismaPermission[],
  ): Permission[] {
    return prismaPermissions.map((p) => this.permissionToDomain(p));
  }
}
