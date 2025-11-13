import { RoleRepositoryPort } from '@context/role/domain/ports/role.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteRoleUseCase {
  constructor(private readonly roleRepository: RoleRepositoryPort) {}

  async execute(roleId: string): Promise<void> {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.roleRepository.delete(roleId);
  }
}
