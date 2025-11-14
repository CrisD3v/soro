/**
 * Company API Types
 */

export interface Company {
  id: string;
  name: string;
  nit: string;
  address: string;
  phone: string;
  parentId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyDto {
  name: string;
  nit: string;
  address: string;
  phone: string;
  parentId?: string | null;
}

export interface UpdateCompanyDto {
  name?: string;
  address?: string;
  phone?: string;
  parentId?: string | null;
}

export interface CompanyFilters {
  parentId?: string | null;
  name?: string;
  includeDeleted?: boolean;
}

export interface CompanyHierarchy {
  parent: Company | null;
  children: Company[];
}
