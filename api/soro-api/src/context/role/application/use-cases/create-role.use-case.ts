import { Role } from '@context/role/domain/entities/role.entity';
import { RoleRepositoryPort } from '@context/role/domain/ports/role.repository.port';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';

@Injectable()
export class CreateRoleUseCase {
  constructor(private readonly roleRepository: RoleRepositoryPort) { }

  async execute(dto: CreateRoleDto): Promise<Role> {
    // Verificar si el nombre ya existe
    const existingRole = await this.roleRepository.findByName(dto.name);
    if (existingRole) {
      throw new ConflictException('Role name already exists');
    }

    return await this.roleRepository.create(dto);
  }
}
