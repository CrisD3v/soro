export interface Company {
  id: string;
  name: string;
  nit: string;
  address?: string;
  phone?: string;
  email?: string;
  sector?: string;
  parentCompanyId?: string;
  isActive: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyDto {
  name: string;
  nit: string;
  address?: string;
  phone?: string;
  email?: string;
  sector?: string;
  parentCompanyId?: string;
}

export interface UpdateCompanyDto {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  sector?: string;
  isActive?: boolean;
}

export interface CompanyHierarchy extends Company {
  children?: CompanyHierarchy[];
}
