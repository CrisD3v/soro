import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateCustomFieldUseCase } from './application/use-cases/create-custom-field.use-case';
import { DeleteCustomFieldUseCase } from './application/use-cases/delete-custom-field.use-case';
import { ListCustomFieldsUseCase } from './application/use-cases/list-custom-fields.use-case';
import { UpdateCustomFieldUseCase } from './application/use-cases/update-custom-field.use-case';
import { CustomFieldController } from './infrastructure/controllers/custom-field.controller';
import { PrismaCustomFieldRepository } from './infrastructure/persistence/prisma-custom-field.repository';

@Module({
  controllers: [CustomFieldController],
  providers: [
    PrismaService,
    {
      provide: 'CustomFieldRepositoryPort',
      useClass: PrismaCustomFieldRepository,
    },
    CreateCustomFieldUseCase,
    ListCustomFieldsUseCase,
    UpdateCustomFieldUseCase,
    DeleteCustomFieldUseCase,
  ],
  exports: ['CustomFieldRepositoryPort'],
})
export class CustomFieldModule { }
