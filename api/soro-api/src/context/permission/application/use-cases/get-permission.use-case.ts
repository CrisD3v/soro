import { Permission } from '@context/permission/domain/entities/permission.entity';
import { PermissionRepositoryPort } from '@context/permission/domain/ports/permission.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetPermissionUseCase {
  constructor(
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async execute(permissionId: string): Promise<Permission> {
    const permission = await this.permissionRepository.findById(permissionId);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }
}
