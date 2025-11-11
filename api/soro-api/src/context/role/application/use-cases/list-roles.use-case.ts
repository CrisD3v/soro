import { Role } from '@context/role/domain/entities/role.entity';
import { RoleRepositoryPort } from '@context/role/domain/ports/role.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListRolesUseCase {
  constructor(private readonly roleRepository: RoleRepositoryPort) { }

  async execute(): Promise<Role[]> {
    return await this.roleRepository.list();
  }
}
