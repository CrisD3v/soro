export class InvoiceEntity {
  id: string;
  invoiceNumber: string;
  companyId: string;
  contactId?: string;
  projectId?: string;
  issueDate: Date;
  dueDate: Date;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  terms?: string;
  items: InvoiceItemEntity[];
  payments: InvoicePaymentEntity[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<InvoiceEntity>) {
    Object.assign(this, partial);
  }

  get isPaid(): boolean {
    return this.status === 'PAID';
  }

  get isOverdue(): boolean {
    return (
      this.status === 'OVERDUE' ||
      (this.status === 'SENT' && new Date() > this.dueDate)
    );
  }

  get remainingAmount(): number {
    const totalPaid = this.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    return this.totalAmount - totalPaid;
  }

  calculateTotals(): void {
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.totalAmount = this.subtotal + this.taxAmount - this.discountAmount;
  }

  markAsSent(): void {
    if (this.status !== 'DRAFT') {
      throw new Error('Only draft invoices can be sent');
    }
    this.status = 'SENT';
  }

  markAsPaid(): void {
    if (this.remainingAmount > 0) {
      throw new Error('Invoice has remaining balance');
    }
    this.status = 'PAID';
  }

  cancel(): void {
    if (this.status === 'PAID') {
      throw new Error('Cannot cancel paid invoice');
    }
    this.status = 'CANCELLED';
  }
}

export class InvoiceItemEntity {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate: number;
  discountRate: number;

  constructor(partial: Partial<InvoiceItemEntity>) {
    Object.assign(this, partial);
    this.calculateTotal();
  }

  calculateTotal(): void {
    const subtotal = this.quantity * this.unitPrice;
    const discount = subtotal * (this.discountRate / 100);
    const taxable = subtotal - discount;
    const tax = taxable * (this.taxRate / 100);
    this.total = taxable + tax;
  }
}

export class InvoicePaymentEntity {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  createdAt: Date;

  constructor(partial: Partial<InvoicePaymentEntity>) {
    Object.assign(this, partial);
  }
}
