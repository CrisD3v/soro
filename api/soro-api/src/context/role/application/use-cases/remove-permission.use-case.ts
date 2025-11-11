import { RoleRepositoryPort } from '@context/role/domain/ports/role.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RemovePermissionUseCase {
  constructor(private readonly roleRepository: RoleRepositoryPort) { }

  async execute(roleId: string, permissionId: string): Promise<void> {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const hasPermission = await this.roleRepository.hasPermission(
      roleId,
      permissionId,
    );

    if (!hasPermission) {
      throw new NotFoundException('Role does not have this permission');
    }

    await this.roleRepository.removePermission(roleId, permissionId);
  }
}
