export interface Permission {
  id: string;
  name: string;
  description: string | null;
}

export class Role {
  constructor(
    public readonly id: string,
    public name: string,
    public permissions?: Permission[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  hasPermission(permissionId: string): boolean {
    return this.permissions?.some((p) => p.id === permissionId) ?? false;
  }

  hasPermissionByName(permissionName: string): boolean {
    return this.permissions?.some((p) => p.name === permissionName) ?? false;
  }

  get permissionCount(): number {
    return this.permissions?.length ?? 0;
  }
}
