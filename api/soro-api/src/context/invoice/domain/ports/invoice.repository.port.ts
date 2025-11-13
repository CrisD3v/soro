import {
  InvoiceEntity,
  InvoicePaymentEntity,
} from '../entities/invoice.entity';

export interface InvoiceRepositoryPort {
  create(invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity>;
  findById(id: string, companyId: string): Promise<InvoiceEntity | null>;
  findByInvoiceNumber(
    invoiceNumber: string,
    companyId: string,
  ): Promise<InvoiceEntity | null>;
  findAll(
    companyId: string,
    filters?: InvoiceFilters,
  ): Promise<InvoiceEntity[]>;
  findByContact(contactId: string, companyId: string): Promise<InvoiceEntity[]>;
  findByProject(projectId: string, companyId: string): Promise<InvoiceEntity[]>;
  update(
    id: string,
    companyId: string,
    data: Partial<InvoiceEntity>,
  ): Promise<InvoiceEntity>;
  delete(id: string, companyId: string): Promise<void>;
  addPayment(
    invoiceId: string,
    companyId: string,
    payment: Partial<InvoicePaymentEntity>,
  ): Promise<InvoicePaymentEntity>;
  getOverdueInvoices(companyId: string): Promise<InvoiceEntity[]>;
  getStatistics(
    companyId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<InvoiceStatistics>;
}

export interface InvoiceFilters {
  status?: string;
  contactId?: string;
  projectId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface InvoiceStatistics {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  averageAmount: number;
}
