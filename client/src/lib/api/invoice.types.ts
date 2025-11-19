/**
 * Invoice API Types
 */

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  contactId: string;
  companyId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  invoiceId: string;
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export interface CreateInvoiceDto {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status?: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string | null;
  contactId: string;
  companyId: string;
  items: CreateInvoiceItemDto[];
}

export interface CreateInvoiceItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface UpdateInvoiceDto {
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  status?: InvoiceStatus;
  subtotal?: number;
  tax?: number;
  total?: number;
  notes?: string | null;
}

export interface InvoiceFilters {
  companyId?: string;
  contactId?: string;
  status?: InvoiceStatus;
  includeDeleted?: boolean;
}
