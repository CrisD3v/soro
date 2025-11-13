import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import type { InvoiceRepositoryPort } from '../../domain/ports/invoice.repository.port';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';

@Injectable()
export class UpdateInvoiceUseCase {
  constructor(
    @Inject('InvoiceRepositoryPort')
    private readonly invoiceRepository: InvoiceRepositoryPort,
  ) { }

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

    const updateData: any = { ...dto };
    if (dto.issueDate) {
      updateData.issueDate = new Date(dto.issueDate);
    }
    if (dto.dueDate) {
      updateData.dueDate = new Date(dto.dueDate);
    }

    return this.invoiceRepository.update(invoiceId, companyId, updateData);
  }
}
