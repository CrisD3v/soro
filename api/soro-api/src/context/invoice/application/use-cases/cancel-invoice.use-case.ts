import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import type { InvoiceRepositoryPort } from '../../domain/ports/invoice.repository.port';

@Injectable()
export class CancelInvoiceUseCase {
  constructor(
    @Inject('InvoiceRepositoryPort')
    private readonly invoiceRepository: InvoiceRepositoryPort,
  ) {}

  async execute(invoiceId: string, companyId: string): Promise<InvoiceEntity> {
    const invoice = await this.invoiceRepository.findById(invoiceId, companyId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    invoice.cancel();

    return this.invoiceRepository.update(invoiceId, companyId, {
      status: invoice.status,
    });
  }
}
