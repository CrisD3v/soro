import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvoicePaymentEntity } from '../../domain/entities/invoice.entity';
import type { InvoiceRepositoryPort } from '../../domain/ports/invoice.repository.port';
import { RegisterPaymentDto } from '../dto/register-payment.dto';

@Injectable()
export class RegisterPaymentUseCase {
  constructor(
    @Inject('InvoiceRepositoryPort')
    private readonly invoiceRepository: InvoiceRepositoryPort,
  ) { }

  async execute(
    invoiceId: string,
    companyId: string,
    dto: RegisterPaymentDto,
  ): Promise<InvoicePaymentEntity> {
    const invoice = await this.invoiceRepository.findById(invoiceId, companyId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === 'CANCELLED') {
      throw new BadRequestException(
        'Cannot register payment for cancelled invoice',
      );
    }

    if (dto.amount > invoice.remainingAmount) {
      throw new BadRequestException('Payment amount exceeds remaining balance');
    }

    const payment = new InvoicePaymentEntity({
      invoiceId,
      amount: dto.amount,
      paymentDate: new Date(dto.paymentDate),
      paymentMethod: dto.paymentMethod,
      reference: dto.reference,
      notes: dto.notes,
    });

    const registeredPayment = await this.invoiceRepository.addPayment(
      invoiceId,
      companyId,
      payment,
    );

    // Check if invoice is fully paid
    const updatedInvoice = await this.invoiceRepository.findById(
      invoiceId,
      companyId,
    );

    if (!updatedInvoice) {
      throw new NotFoundException('Invoice not found after payment registration');
    }

    if (updatedInvoice.remainingAmount === 0) {
      updatedInvoice.markAsPaid();
      await this.invoiceRepository.update(invoiceId, companyId, {
        status: 'PAID',
      });
    }

    return registeredPayment;
  }
}
