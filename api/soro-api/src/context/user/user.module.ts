import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AssignRoleUseCase } from './application/use-cases/assign-role.use-case';
import { AssignSignatureUseCase } from './application/use-cases/assign-signature.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { UserRepositoryPort } from './domain/ports/user.repository.port';
import { UserController } from './infrastructure/controllers/user.controller';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    PrismaUserRepository,
    {
      provide: UserRepositoryPort,
      useClass: PrismaUserRepository,
    },
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    AssignRoleUseCase,
    AssignSignatureUseCase,
  ],
  exports: [UserRepositoryPort],
})
export class UserModule { }
