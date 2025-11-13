import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CloseDealUseCase } from './application/use-cases/close-deal.use-case';
import { CreateDealUseCase } from './application/use-cases/create-deal.use-case';
import { DeleteDealUseCase } from './application/use-cases/delete-deal.use-case';
import { GetDealUseCase } from './application/use-cases/get-deal.use-case';
import { ListDealsUseCase } from './application/use-cases/list-deals.use-case';
import { UpdateDealUseCase } from './application/use-cases/update-deal.use-case';
import { DealRepositoryPort } from './domain/ports/deal.repository.port';
import { DealController } from './infrastructure/controllers/deal.controller';
import { PrismaDealRepository } from './infrastructure/persistence/prisma-deal.repository';

@Module({
  controllers: [DealController],
  providers: [
    PrismaService,
    PrismaDealRepository,
    {
      provide: DealRepositoryPort,
      useClass: PrismaDealRepository,
    },
    CreateDealUseCase,
    UpdateDealUseCase,
    GetDealUseCase,
    ListDealsUseCase,
    DeleteDealUseCase,
    CloseDealUseCase,
  ],
  exports: [DealRepositoryPort],
})
export class DealModule {}
