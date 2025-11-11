export enum DocumentType {
  CC = 'CC',
  CE = 'CE',
  TI = 'TI',
}

export class Document {
  constructor(
    public readonly number: string,
    public readonly type: DocumentType,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.number || this.number.trim().length === 0) {
      throw new Error('Document number cannot be empty');
    }

    if (!Object.values(DocumentType).includes(this.type)) {
      throw new Error('Invalid document type');
    }
  }

  toString(): string {
    return `${this.type}-${this.number}`;
  }
}
