import { UserRepositoryPort } from '@context/user/domain/ports/user.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignRoleDto } from '../dto/assign-role.dto';

@Injectable()
export class AssignRoleUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(userId: string, dto: AssignRoleDto): Promise<void> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.assignRole({
      userId,
      roleId: dto.roleId,
      companyId: dto.companyId,
    });
  }
}
