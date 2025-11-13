import { Inject, Injectable } from '@nestjs/common';
import {
  InvoiceEntity,
  InvoiceItemEntity,
} from '../../domain/entities/invoice.entity';
import { InvoiceRepositoryPort } from '../../domain/ports/invoice.repository.port';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject('InvoiceRepositoryPort')
    private readonly invoiceRepository: InvoiceRepositoryPort,
  ) {}

  async execute(
    dto: CreateInvoiceDto,
    companyId: string,
  ): Promise<InvoiceEntity> {
    // Check if invoice number already exists
    const existing = await this.invoiceRepository.findByInvoiceNumber(
      dto.invoiceNumber,
      companyId,
    );
    if (existing) {
      throw new Error('Invoice number already exists');
    }

    // Create invoice items
    const items = dto.items.map(
      (item) =>
        new InvoiceItemEntity({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate || 0,
          discountRate: item.discountRate || 0,
        }),
    );

    // Create invoice entity
    const invoice = new InvoiceEntity({
      invoiceNumber: dto.invoiceNumber,
      companyId,
      contactId: dto.contactId,
      projectId: dto.projectId,
      issueDate: new Date(dto.issueDate),
      dueDate: new Date(dto.dueDate),
      status: dto.status || 'DRAFT',
      currency: dto.currency,
      notes: dto.notes,
      terms: dto.terms,
      items,
      payments: [],
      taxAmount: dto.taxAmount || 0,
      discountAmount: dto.discountAmount || 0,
    });

    // Calculate totals
    invoice.calculateTotals();

    // Save to database
    return this.invoiceRepository.create(invoice);
  }
}
