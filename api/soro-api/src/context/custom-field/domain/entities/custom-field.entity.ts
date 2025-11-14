export class CustomFieldEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly entity: string,
    public readonly fieldName: string,
    public readonly fieldType: string,
    public readonly fieldConfig: Record<string, any>,
    public readonly isRequired: boolean,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }

  get isText(): boolean {
    return this.fieldType === 'text';
  }

  get isNumber(): boolean {
    return this.fieldType === 'number';
  }

  get isDate(): boolean {
    return this.fieldType === 'date';
  }

  get isSelect(): boolean {
    return this.fieldType === 'select';
  }
}
