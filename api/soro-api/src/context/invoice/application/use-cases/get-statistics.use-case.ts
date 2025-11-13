import { Inject, Injectable } from '@nestjs/common';
import type {
  InvoiceRepositoryPort,
  InvoiceStatistics,
} from '../../domain/ports/invoice.repository.port';

@Injectable()
export class GetStatisticsUseCase {
  constructor(
    @Inject('InvoiceRepositoryPort')
    private readonly invoiceRepository: InvoiceRepositoryPort,
  ) { }

  async execute(
    companyId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<InvoiceStatistics> {
    return this.invoiceRepository.getStatistics(companyId, startDate, endDate);
  }
}
