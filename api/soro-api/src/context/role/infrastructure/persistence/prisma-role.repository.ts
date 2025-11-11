import { Permission, Role } from '@context/role/domain/entities/role.entity';
import {
  AssignPermissionData,
  CreateRoleData,
  RoleRepositoryPort,
  UpdateRoleData,
} from '@context/role/domain/ports/role.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RoleMapper } from '../mappers/role.mapper';

@Injectable()
export class PrismaRoleRepository implements RoleRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateRoleData): Promise<Role> {
    const role = await this.prisma.role.create({
      data: {
        name: data.name,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return RoleMapper.toDomain(role);
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return role ? RoleMapper.toDomain(role) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return role ? RoleMapper.toDomain(role) : null;
  }

  async update(id: string, data: UpdateRoleData): Promise<Role> {
    const role = await this.prisma.role.update({
      where: { id },
      data,
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return RoleMapper.toDomain(role);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }

  async list(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return RoleMapper.toDomainList(roles);
  }

  async assignPermission(data: AssignPermissionData): Promise<void> {
    await this.prisma.rolePermission.create({
      data: {
        roleId: data.roleId,
        permissionId: data.permissionId,
      },
    });
  }

  async removePermission(roleId: string, permissionId: string): Promise<void> {
    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });
  }

  async getPermissions(roleId: string): Promise<Permission[]> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        permission: true,
      },
    });

    return rolePermissions.map((rp) => RoleMapper.permissionToDomain(rp.permission));
  }

  async hasPermission(roleId: string, permissionId: string): Promise<boolean> {
    const rolePermission = await this.prisma.rolePermission.findFirst({
      where: {
        roleId,
        permissionId,
      },
    });

    return !!rolePermission;
  }
}
