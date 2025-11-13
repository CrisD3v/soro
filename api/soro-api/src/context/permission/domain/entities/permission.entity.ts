import { PermissionScope } from '@prisma/client';

export class Permission {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public resource: string,
    public action: string,
    public scope: PermissionScope,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  get fullName(): string {
    return `${this.resource}.${this.action}`;
  }

  isGlobal(): boolean {
    return this.scope === 'GLOBAL';
  }

  isCompanyScoped(): boolean {
    return this.scope === 'COMPANY';
  }

  isProjectScoped(): boolean {
    return this.scope === 'PROJECT';
  }

  isResourceScoped(): boolean {
    return this.scope === 'RESOURCE';
  }
}
