import { User } from '@context/user/domain/entities/user.entity';
import { UserRepositoryPort } from '@context/user/domain/ports/user.repository.port';
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) { }

  async execute(dto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Verificar si el documento ya existe
    const existingDocument = await this.userRepository.findByDocumentNumber(
      dto.documentNumber,
    );
    if (existingDocument) {
      throw new ConflictException('Document number already exists');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Crear usuario
    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return user;
  }
}
