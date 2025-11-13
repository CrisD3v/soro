import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { GetPermissionUseCase } from './application/use-cases/get-permission.use-case';
import { ListPermissionsUseCase } from './application/use-cases/list-permissions.use-case';
import { PermissionRepositoryPort } from './domain/ports/permission.repository.port';
import { PermissionController } from './infrastructure/controllers/permission.controller';
import { PrismaPermissionRepository } from './infrastructure/persistence/prisma-permission.repository';

@Module({
  controllers: [PermissionController],
  providers: [
    PrismaService,
    PrismaPermissionRepository,
    {
      provide: PermissionRepositoryPort,
      useClass: PrismaPermissionRepository,
    },
    ListPermissionsUseCase,
    GetPermissionUseCase,
  ],
  exports: [PermissionRepositoryPort],
})
export class PermissionModule {}
