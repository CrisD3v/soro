import { Permission } from '@context/role/domain/entities/role.entity';
import { RoleRepositoryPort } from '@context/role/domain/ports/role.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetRolePermissionsUseCase {
  constructor(private readonly roleRepository: RoleRepositoryPort) { }

  async execute(roleId: string): Promise<Permission[]> {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return await this.roleRepository.getPermissions(roleId);
  }
}
