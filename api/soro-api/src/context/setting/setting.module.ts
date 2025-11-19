import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateSettingUseCase } from './application/use-cases/create-setting.use-case';
import { DeleteSettingUseCase } from './application/use-cases/delete-setting.use-case';
import { GetSettingByKeyUseCase } from './application/use-cases/get-setting-by-key.use-case';
import { GetSettingUseCase } from './application/use-cases/get-setting.use-case';
import { ListSettingsUseCase } from './application/use-cases/list-settings.use-case';
import { UpdateSettingUseCase } from './application/use-cases/update-setting.use-case';
import { SettingRepositoryPort } from './domain/ports/setting.repository.port';
import { SettingController } from './infrastructure/controllers/setting.controller';
import { PrismaSettingRepository } from './infrastructure/persistence/prisma-setting.repository';

@Module({
  controllers: [SettingController],
  providers: [
    PrismaService,
    PrismaSettingRepository,
    {
      provide: SettingRepositoryPort,
      useClass: PrismaSettingRepository,
    },
    CreateSettingUseCase,
    GetSettingUseCase,
    GetSettingByKeyUseCase,
    UpdateSettingUseCase,
    DeleteSettingUseCase,
    ListSettingsUseCase,
  ],
  exports: [SettingRepositoryPort],
})
export class SettingModule { }
