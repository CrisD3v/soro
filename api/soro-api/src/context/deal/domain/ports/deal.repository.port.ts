import { Deal } from '../entities/deal.entity';

export interface CreateDealData {
  companyId: string;
  contactId: string;
  title: string;
  description?: string;
  value: number;
  currency?: string;
  stage?: string;
  probability?: number;
  expectedCloseDate?: Date;
  assignedTo?: string;
  createdBy: string;
}

export interface UpdateDealData {
  title?: string;
  description?: string;
  value?: number;
  currency?: string;
  stage?: string;
  probability?: number;
  expectedCloseDate?: Date;
  assignedTo?: string;
}

export interface ListDealsFilters {
  companyId?: string;
  contactId?: string;
  stage?: string;
  assignedTo?: string;
}

export abstract class DealRepositoryPort {
  abstract create(data: CreateDealData): Promise<Deal>;
  abstract findById(id: string): Promise<Deal | null>;
  abstract update(id: string, data: UpdateDealData): Promise<Deal>;
  abstract delete(id: string): Promise<void>;
  abstract list(filters?: ListDealsFilters): Promise<Deal[]>;
  abstract close(id: string, won: boolean): Promise<Deal>;
}
