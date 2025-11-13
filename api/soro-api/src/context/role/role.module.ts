import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AssignPermissionUseCase } from './application/use-cases/assign-permission.use-case';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from './application/use-cases/delete-role.use-case';
import { GetRolePermissionsUseCase } from './application/use-cases/get-role-permissions.use-case';
import { GetRoleUseCase } from './application/use-cases/get-role.use-case';
import { ListRolesUseCase } from './application/use-cases/list-roles.use-case';
import { RemovePermissionUseCase } from './application/use-cases/remove-permission.use-case';
import { UpdateRoleUseCase } from './application/use-cases/update-role.use-case';
import { RoleRepositoryPort } from './domain/ports/role.repository.port';
import { RoleController } from './infrastructure/controllers/role.controller';
import { PrismaRoleRepository } from './infrastructure/persistence/prisma-role.repository';

@Module({
  controllers: [RoleController],
  providers: [
    PrismaService,
    PrismaRoleRepository,
    {
      provide: RoleRepositoryPort,
      useClass: PrismaRoleRepository,
    },
    CreateRoleUseCase,
    UpdateRoleUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    DeleteRoleUseCase,
    AssignPermissionUseCase,
    RemovePermissionUseCase,
    GetRolePermissionsUseCase,
  ],
  exports: [RoleRepositoryPort],
})
export class RoleModule {}
