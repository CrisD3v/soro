export class Company {
  constructor(
    public readonly id: string,
    public name: string,
    public nit: string,
    public address: string,
    public phone: string,
    public parentId: string | null,
    public deletedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public parent?: Company | null,
    public children?: Company[],
  ) {}

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  isParent(): boolean {
    return this.children !== undefined && this.children.length > 0;
  }

  hasParent(): boolean {
    return this.parentId !== null;
  }

  softDelete(): void {
    this.deletedAt = new Date();
  }

  restore(): void {
    this.deletedAt = null;
  }
}
