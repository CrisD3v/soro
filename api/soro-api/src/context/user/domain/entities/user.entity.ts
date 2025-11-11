import { DocumentType } from '../value-objects/document.vo';

export interface UserRole {
  id: string;
  roleId: string;
  companyId: string;
  createdAt: Date;
}

export interface Signature {
  id: string;
  signature: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public name: string,
    public lastName: string,
    public documentNumber: string,
    public documentType: DocumentType,
    public phone: string,
    public companyId: string,
    public roles?: UserRole[],
    public signature?: Signature,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) { }

  get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }

  hasRole(roleId: string, companyId: string): boolean {
    return this.roles?.some(
      (r) => r.roleId === roleId && r.companyId === companyId,
    ) ?? false;
  }

  hasSignature(): boolean {
    return !!this.signature;
  }
}
