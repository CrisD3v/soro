import { Permission } from '@context/permission/domain/entities/permission.entity';
import {
  ListPermissionsFilters,
  PermissionRepositoryPort,
} from '@context/permission/domain/ports/permission.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListPermissionsUseCase {
  constructor(
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async execute(filters?: ListPermissionsFilters): Promise<Permission[]> {
    return await this.permissionRepository.list(filters);
  }
}
