import { UserRepositoryPort } from '@context/user/domain/ports/user.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignSignatureDto } from '../dto/assign-signature.dto';

@Injectable()
export class AssignSignatureUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) { }

  async execute(userId: string, dto: AssignSignatureDto): Promise<void> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Si ya tiene firma, actualizar; si no, crear
    if (user.hasSignature()) {
      await this.userRepository.updateSignature(userId, dto.signature);
    } else {
      await this.userRepository.assignSignature({
        userId,
        signature: dto.signature,
      });
    }
  }
}
