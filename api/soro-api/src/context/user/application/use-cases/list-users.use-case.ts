import { User } from '@context/user/domain/entities/user.entity';
import {
  ListUsersFilters,
  UserRepositoryPort,
} from '@context/user/domain/ports/user.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(filters?: ListUsersFilters): Promise<User[]> {
    return await this.userRepository.list(filters);
  }
}
