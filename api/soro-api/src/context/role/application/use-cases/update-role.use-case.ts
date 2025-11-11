import { Role } from '@context/role/domain/entities/role.entity';
import { RoleRepositoryPort } from '@context/role/domain/ports/role.repository.port';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class UpdateRoleUseCase {
  constructor(private readonly roleRepository: RoleRepositoryPort) { }

  async execute(roleId: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Si se actualiza el nombre, verificar que no exista
    if (dto.name && dto.name !== role.name) {
      const existingRole = await this.roleRepository.findByName(dto.name);
      if (existingRole) {
        throw new ConflictException('Role name already exists');
      }
    }

    return await this.roleRepository.update(roleId, dto);
  }
}
