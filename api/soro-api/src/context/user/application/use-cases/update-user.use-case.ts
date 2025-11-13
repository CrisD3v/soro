import { User } from '@context/user/domain/entities/user.entity';
import { UserRepositoryPort } from '@context/user/domain/ports/user.repository.port';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(userId: string, dto: UpdateUserDto): Promise<User> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Si se actualiza el email, verificar que no exista
    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.userRepository.findByEmail(dto.email);
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Si se actualiza la contraseña, hashearla
    const updateData = { ...dto };
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    return await this.userRepository.update(userId, updateData);
  }
}
