/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  InvoiceItemResponseDto,
  InvoicePaymentResponseDto,
  InvoiceResponseDto,
} from '../../application/dto/invoice-response.dto';
import {
  InvoiceEntity,
  InvoiceItemEntity,
  InvoicePaymentEntity,
} from '../../domain/entities/invoice.entity';

export class InvoiceMapper {
  static toDomain(raw: any): InvoiceEntity {
    const id = raw.id as string;
    const invoiceNumber = raw.invoiceNumber as string;
    const companyId = raw.companyId as string;
    const contactId = raw.contactId as string | undefined;
    const projectId = raw.projectId as string | undefined;
    const issueDate = (raw.issueDate || raw.createdAt) as Date;
    const dueDate = raw.dueDate as Date;
    const status = (raw.status as string).toUpperCase() as
      | 'DRAFT'
      | 'SENT'
      | 'PAID'
      | 'OVERDUE'
      | 'CANCELLED';
    const subtotal = raw.subtotal as number;
    const taxAmount = (raw.tax || 0) as number;
    const discountAmount = (raw.discountAmount || 0) as number;
    const totalAmount = raw.total as number;
    const currency = raw.currency as string;
    const notes = raw.notes as string | undefined;
    const terms = raw.terms as string | undefined;
    const items = (raw.items?.map((item: any) => new InvoiceItemEntity(item)) ||
      []) as InvoiceItemEntity[];
    const payments = (raw.payments?.map(
      (payment: any) =>
        new InvoicePaymentEntity({
          ...payment,
          paymentDate: payment.paidAt || payment.createdAt,
          paymentMethod: payment.method,
        }),
    ) || []) as InvoicePaymentEntity[];
    const createdAt = raw.createdAt as Date;
    const updatedAt = raw.updatedAt as Date;

    return new InvoiceEntity({
      id,
      invoiceNumber,
      companyId,
      contactId,
      projectId,
      issueDate,
      dueDate,
      status,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      currency,
      notes,
      terms,
      items,
      payments,
      createdAt,
      updatedAt,
    });
  }

  static toResponse(entity: InvoiceEntity): InvoiceResponseDto {
    return {
      id: entity.id,
      invoiceNumber: entity.invoiceNumber,
      companyId: entity.companyId,
      contactId: entity.contactId,
      projectId: entity.projectId,
      issueDate: entity.issueDate,
      dueDate: entity.dueDate,
      status: entity.status,
      subtotal: entity.subtotal,
      taxAmount: entity.taxAmount,
      discountAmount: entity.discountAmount,
      totalAmount: entity.totalAmount,
      remainingAmount: entity.remainingAmount,
      currency: entity.currency,
      notes: entity.notes,
      terms: entity.terms,
      items: entity.items.map((item) => this.toItemResponse(item)),
      payments: entity.payments.map((payment) =>
        this.toPaymentResponse(payment),
      ),
      isPaid: entity.isPaid,
      isOverdue: entity.isOverdue,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toItemResponse(item: InvoiceItemEntity): InvoiceItemResponseDto {
    return {
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
      taxRate: item.taxRate,
      discountRate: item.discountRate,
    };
  }

  static toPaymentResponse(
    payment: InvoicePaymentEntity,
  ): InvoicePaymentResponseDto {
    return {
      id: payment.id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      reference: payment.reference,
      notes: payment.notes,
      createdAt: payment.createdAt,
    };
  }
}
