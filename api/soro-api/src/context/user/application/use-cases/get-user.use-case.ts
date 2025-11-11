import { User } from '@context/user/domain/entities/user.entity';
import { UserRepositoryPort } from '@context/user/domain/ports/user.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) { }

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
