import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CancelInvoiceUseCase } from './application/use-cases/cancel-invoice.use-case';
import { CreateInvoiceUseCase } from './application/use-cases/create-invoice.use-case';
import { GetInvoiceUseCase } from './application/use-cases/get-invoice.use-case';
import { GetStatisticsUseCase } from './application/use-cases/get-statistics.use-case';
import { ListInvoicesUseCase } from './application/use-cases/list-invoices.use-case';
import { RegisterPaymentUseCase } from './application/use-cases/register-payment.use-case';
import { SendInvoiceUseCase } from './application/use-cases/send-invoice.use-case';
import { UpdateInvoiceUseCase } from './application/use-cases/update-invoice.use-case';
import { InvoiceController } from './infrastructure/controllers/invoice.controller';
import { PrismaInvoiceRepository } from './infrastructure/persistence/prisma-invoice.repository';

@Module({
  controllers: [InvoiceController],
  providers: [
    PrismaService,
    {
      provide: 'InvoiceRepositoryPort',
      useClass: PrismaInvoiceRepository,
    },
    CreateInvoiceUseCase,
    SendInvoiceUseCase,
    RegisterPaymentUseCase,
    ListInvoicesUseCase,
    GetInvoiceUseCase,
    UpdateInvoiceUseCase,
    CancelInvoiceUseCase,
    GetStatisticsUseCase,
  ],
  exports: [CreateInvoiceUseCase, ListInvoicesUseCase, GetInvoiceUseCase],
})
export class InvoiceModule {}
