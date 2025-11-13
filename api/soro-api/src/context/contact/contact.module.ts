import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateContactUseCase } from './application/use-cases/create-contact.use-case';
import { DeleteContactUseCase } from './application/use-cases/delete-contact.use-case';
import { GetContactUseCase } from './application/use-cases/get-contact.use-case';
import { ListContactsUseCase } from './application/use-cases/list-contacts.use-case';
import { UpdateContactUseCase } from './application/use-cases/update-contact.use-case';
import { ContactRepositoryPort } from './domain/ports/contact.repository.port';
import { ContactController } from './infrastructure/controllers/contact.controller';
import { PrismaContactRepository } from './infrastructure/persistence/prisma-contact.repository';

@Module({
  controllers: [ContactController],
  providers: [
    PrismaService,
    PrismaContactRepository,
    {
      provide: ContactRepositoryPort,
      useClass: PrismaContactRepository,
    },
    CreateContactUseCase,
    UpdateContactUseCase,
    GetContactUseCase,
    ListContactsUseCase,
    DeleteContactUseCase,
  ],
  exports: [ContactRepositoryPort],
})
export class ContactModule {}
