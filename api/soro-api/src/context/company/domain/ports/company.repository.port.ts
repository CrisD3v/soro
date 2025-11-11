import { Company } from '../entities/company.entity';

export interface CreateCompanyData {
  name: string;
  nit: string;
  address: string;
  phone: string;
  parentId?: string;
}

export interface UpdateCompanyData {
  name?: string;
  address?: string;
  phone?: string;
  parentId?: string;
}

export interface ListCompaniesFilters {
  parentId?: string;
  includeDeleted?: boolean;
  name?: string;
}

export abstract class CompanyRepositoryPort {
  abstract create(data: CreateCompanyData): Promise<Company>;
  abstract findById(id: string, includeDeleted?: boolean): Promise<Company | null>;
  abstract findByNit(nit: string, includeDeleted?: boolean): Promise<Company | null>;
  abstract update(id: string, data: UpdateCompanyData): Promise<Company>;
  abstract softDelete(id: string): Promise<void>;
  abstract restore(id: string): Promise<void>;
  abstract list(filters?: ListCompaniesFilters): Promise<Company[]>;
  abstract findChildren(parentId: string, includeDeleted?: boolean): Promise<Company[]>;
  abstract findHierarchy(companyId: string): Promise<Company>;
}
