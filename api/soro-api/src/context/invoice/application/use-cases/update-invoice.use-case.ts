import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { InvoiceRepositoryPort } from '../../domain/ports/invoice.repository.port';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';

@Injectable()
export class UpdateInvoiceUseCase {
  constructor(
    @Inject('InvoiceRepositoryPort')
    private readonly invoiceRepository: InvoiceRepositoryPort,
  ) {}

  async execute(
    invoiceId: string,
    companyId: string,
    dto: UpdateInvoiceDto,
  ): Promise<InvoiceEntity> {
    const invoice = await this.invoiceRepository.findById(invoiceId, companyId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === 'PAID') {
      throw new BadRequestException('Cannot update paid invoice');
    }

    if (invoice.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update cancelled invoice');
    }

    return this.invoiceRepository.update(invoiceId, companyId, dto);
  }
}
