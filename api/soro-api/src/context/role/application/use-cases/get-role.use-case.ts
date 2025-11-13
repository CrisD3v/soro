import { Role } from '@context/role/domain/entities/role.entity';
import { RoleRepositoryPort } from '@context/role/domain/ports/role.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetRoleUseCase {
  constructor(private readonly roleRepository: RoleRepositoryPort) {}

  async execute(roleId: string): Promise<Role> {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
