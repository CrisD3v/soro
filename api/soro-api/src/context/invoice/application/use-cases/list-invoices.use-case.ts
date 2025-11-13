import { Inject, Injectable } from '@nestjs/common';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import type {
  InvoiceFilters,
  InvoiceRepositoryPort,
} from '../../domain/ports/invoice.repository.port';

@Injectable()
export class ListInvoicesUseCase {
  constructor(
    @Inject('InvoiceRepositoryPort')
    private readonly invoiceRepository: InvoiceRepositoryPort,
  ) { }

  async execute(
    companyId: string,
    filters?: InvoiceFilters,
  ): Promise<InvoiceEntity[]> {
    return this.invoiceRepository.findAll(companyId, filters);
  }
}
