import { RoleRepositoryPort } from '@context/role/domain/ports/role.repository.port';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AssignPermissionDto } from '../dto/assign-permission.dto';

@Injectable()
export class AssignPermissionUseCase {
  constructor(private readonly roleRepository: RoleRepositoryPort) { }

  async execute(roleId: string, dto: AssignPermissionDto): Promise<void> {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Verificar si ya tiene el permiso
    const hasPermission = await this.roleRepository.hasPermission(
      roleId,
      dto.permissionId,
    );

    if (hasPermission) {
      throw new ConflictException('Role already has this permission');
    }

    await this.roleRepository.assignPermission({
      roleId,
      permissionId: dto.permissionId,
    });
  }
}
