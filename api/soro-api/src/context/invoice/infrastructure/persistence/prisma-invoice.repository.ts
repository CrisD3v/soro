/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  InvoiceEntity,
  InvoicePaymentEntity,
} from '../../domain/entities/invoice.entity';
import {
  InvoiceFilters,
  InvoiceRepositoryPort,
  InvoiceStatistics,
} from '../../domain/ports/invoice.repository.port';
import { InvoiceMapper } from '../mappers/invoice.mapper';

@Injectable()
export class PrismaInvoiceRepository implements InvoiceRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
    const data = await this.prisma.invoice.create({
      data: {
        invoiceNumber: invoice.invoiceNumber!,
        companyId: invoice.companyId!,
        contactId: invoice.contactId,
        projectId: invoice.projectId,
        issueDate: invoice.issueDate!,
        dueDate: invoice.dueDate,
        status: invoice.status?.toLowerCase() || 'draft',
        subtotal: invoice.subtotal!,
        tax: invoice.taxAmount || 0,
        discountAmount: invoice.discountAmount || 0,
        total: invoice.totalAmount!,
        currency: invoice.currency || 'USD',
        notes: invoice.notes,
        terms: invoice.terms,
        createdBy: 'system', // TODO: Get from context
        items: {
          create: invoice.items?.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            taxRate: item.taxRate,
            discountRate: item.discountRate,
          })),
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    return InvoiceMapper.toDomain(data);
  }

  async findById(id: string, companyId: string): Promise<InvoiceEntity | null> {
    const data = await this.prisma.invoice.findFirst({
      where: { id, companyId },
      include: {
        items: true,
        payments: true,
      },
    });

    return data ? InvoiceMapper.toDomain(data) : null;
  }

  async findByInvoiceNumber(
    invoiceNumber: string,
    companyId: string,
  ): Promise<InvoiceEntity | null> {
    const data = await this.prisma.invoice.findFirst({
      where: { invoiceNumber, companyId },
      include: {
        items: true,
        payments: true,
      },
    });

    return data ? InvoiceMapper.toDomain(data) : null;
  }

  async findAll(
    companyId: string,
    filters?: InvoiceFilters,
  ): Promise<InvoiceEntity[]> {
    const where: Record<string, any> = { companyId };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.contactId) {
      where.contactId = filters.contactId;
    }
    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }
    if (filters?.startDate || filters?.endDate) {
      where.issueDate = {};
      if (filters.startDate) {
        where.issueDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.issueDate.lte = filters.endDate;
      }
    }
    if (filters?.minAmount || filters?.maxAmount) {
      where.total = {};
      if (filters.minAmount) {
        where.total.gte = filters.minAmount;
      }
      if (filters.maxAmount) {
        where.total.lte = filters.maxAmount;
      }
    }

    const data = await this.prisma.invoice.findMany({
      where,
      include: {
        items: true,
        payments: true,
      },
      orderBy: { issueDate: 'desc' },
    });

    return data.map((invoice) => InvoiceMapper.toDomain(invoice));
  }

  async findByContact(
    contactId: string,
    companyId: string,
  ): Promise<InvoiceEntity[]> {
    const data = await this.prisma.invoice.findMany({
      where: { contactId, companyId },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { issueDate: 'desc' },
    });

    return data.map((invoice) => InvoiceMapper.toDomain(invoice));
  }

  async findByProject(
    projectId: string,
    companyId: string,
  ): Promise<InvoiceEntity[]> {
    const data = await this.prisma.invoice.findMany({
      where: { projectId, companyId },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { issueDate: 'desc' },
    });

    return data.map((invoice) => InvoiceMapper.toDomain(invoice));
  }

  async update(
    id: string,
    companyId: string,
    data: Partial<InvoiceEntity>,
  ): Promise<InvoiceEntity> {
    const updated = await this.prisma.invoice.update({
      where: { id },
      data: {
        status: data.status?.toLowerCase(),
        notes: data.notes,
        terms: data.terms,
      },
      include: {
        items: true,
        payments: true,
      },
    });

    return InvoiceMapper.toDomain(updated);
  }

  async delete(id: string, companyId: string): Promise<void> {
    await this.prisma.invoice.delete({
      where: { id },
    });
  }

  async addPayment(
    invoiceId: string,
    _companyId: string,
    payment: Partial<InvoicePaymentEntity>,
  ): Promise<InvoicePaymentEntity> {
    const data = await this.prisma.payment.create({
      data: {
        invoiceId,
        amount: payment.amount!,
        paidAt: payment.paymentDate,
        method: payment.paymentMethod!,
        transactionId: payment.reference,
        status: 'completed',
      },
    });

    return new InvoicePaymentEntity({
      ...data,
      paymentDate: data.paidAt || data.createdAt,
      paymentMethod: data.method,
      reference: data.transactionId || undefined,
      notes: undefined,
    });
  }

  async getOverdueInvoices(companyId: string): Promise<InvoiceEntity[]> {
    const data = await this.prisma.invoice.findMany({
      where: {
        companyId,
        status: { in: ['sent', 'overdue'] },
        dueDate: { lt: new Date() },
      },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    return data.map((invoice) => InvoiceMapper.toDomain(invoice));
  }

  async getStatistics(
    companyId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<InvoiceStatistics> {
    const where: Record<string, any> = { companyId };

    if (startDate || endDate) {
      where.issueDate = {};
      if (startDate) {
        where.issueDate.gte = startDate;
      }
      if (endDate) {
        where.issueDate.lte = endDate;
      }
    }

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: { payments: true },
    });

    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
    const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

    const overdueInvoices = invoices.filter(
      (inv) =>
        (inv.status === 'sent' || inv.status === 'overdue') &&
        inv.dueDate &&
        inv.dueDate < new Date(),
    );
    const overdueAmount = overdueInvoices.reduce(
      (sum, inv) => sum + inv.total,
      0,
    );

    const pendingAmount = totalAmount - paidAmount;
    const averageAmount = totalInvoices > 0 ? totalAmount / totalInvoices : 0;

    return {
      totalInvoices,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      averageAmount,
    };
  }
}
