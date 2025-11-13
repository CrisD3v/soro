import { Permission } from '@context/permission/domain/entities/permission.entity';
import {
  CreatePermissionData,
  ListPermissionsFilters,
  PermissionRepositoryPort,
  UpdatePermissionData,
} from '@context/permission/domain/ports/permission.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { PermissionMapper } from '../mappers/permission.mapper';

@Injectable()
export class PrismaPermissionRepository implements PermissionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePermissionData): Promise<Permission> {
    const permission = await this.prisma.permission.create({
      data,
    });

    return PermissionMapper.toDomain(permission);
  }

  async findById(id: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    return permission ? PermissionMapper.toDomain(permission) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { name },
    });

    return permission ? PermissionMapper.toDomain(permission) : null;
  }

  async update(id: string, data: UpdatePermissionData): Promise<Permission> {
    const permission = await this.prisma.permission.update({
      where: { id },
      data,
    });

    return PermissionMapper.toDomain(permission);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.permission.delete({
      where: { id },
    });
  }

  async list(filters?: ListPermissionsFilters): Promise<Permission[]> {
    const where: any = {};

    if (filters?.resource) {
      where.resource = filters.resource;
    }

    if (filters?.action) {
      where.action = filters.action;
    }

    if (filters?.scope) {
      where.scope = filters.scope;
    }

    const permissions = await this.prisma.permission.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return PermissionMapper.toDomainList(permissions);
  }
}
