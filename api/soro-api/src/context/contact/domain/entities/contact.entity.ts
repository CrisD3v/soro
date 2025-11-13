export class Contact {
  constructor(
    public readonly id: string,
    public companyId: string,
    public type: string,
    public name: string,
    public email: string | null,
    public phone: string | null,
    public address: string | null,
    public notes: string | null,
    public customData: Record<string, any>,
    public createdBy: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  isLead(): boolean {
    return this.type === 'lead';
  }

  isClient(): boolean {
    return this.type === 'client';
  }

  isSupplier(): boolean {
    return this.type === 'supplier';
  }

  isPartner(): boolean {
    return this.type === 'partner';
  }

  convertToClient(): void {
    this.type = 'client';
  }
}
