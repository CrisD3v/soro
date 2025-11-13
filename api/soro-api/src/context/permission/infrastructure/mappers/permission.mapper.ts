import { Permission } from '@context/permission/domain/entities/permission.entity';
import { Permission as PrismaPermission } from '@prisma/client';

export class PermissionMapper {
  static toDomain(prismaPermission: PrismaPermission): Permission {
    return new Permission(
      prismaPermission.id,
      prismaPermission.name,
      prismaPermission.description,
      prismaPermission.resource,
      prismaPermission.action,
      prismaPermission.scope,
      prismaPermission.createdAt,
      prismaPermission.updatedAt,
    );
  }

  static toDomainList(prismaPermissions: PrismaPermission[]): Permission[] {
    return prismaPermissions.map((permission) => this.toDomain(permission));
  }
}
