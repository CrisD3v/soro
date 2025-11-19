/**
 * Deal API Types
 */

export interface Deal {
  id: string;
  title: string;
  description: string | null;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string | null;
  actualCloseDate: string | null;
  contactId: string;
  companyId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum DealStage {
  LEAD = 'LEAD',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export interface CreateDealDto {
  title: string;
  description?: string | null;
  value: number;
  stage?: DealStage;
  probability?: number;
  expectedCloseDate?: string | null;
  contactId: string;
  companyId: string;
}

export interface UpdateDealDto {
  title?: string;
  description?: string | null;
  value?: number;
  stage?: DealStage;
  probability?: number;
  expectedCloseDate?: string | null;
  actualCloseDate?: string | null;
}

export interface DealFilters {
  companyId?: string;
  contactId?: string;
  stage?: DealStage;
  includeDeleted?: boolean;
}
