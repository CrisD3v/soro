/**
 * Contact API Types
 */

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string | null;
  companyName: string | null;
  status: ContactStatus;
  source: ContactSource;
  notes: string | null;
  companyId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum ContactStatus {
  LEAD = 'LEAD',
  QUALIFIED = 'QUALIFIED',
  CUSTOMER = 'CUSTOMER',
  INACTIVE = 'INACTIVE',
}

export enum ContactSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  OTHER = 'OTHER',
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone: string;
  position?: string | null;
  companyName?: string | null;
  status?: ContactStatus;
  source?: ContactSource;
  notes?: string | null;
  companyId: string;
}

export interface UpdateContactDto {
  name?: string;
  email?: string;
  phone?: string;
  position?: string | null;
  companyName?: string | null;
  status?: ContactStatus;
  source?: ContactSource;
  notes?: string | null;
}

export interface ContactFilters {
  companyId?: string;
  status?: ContactStatus;
  source?: ContactSource;
  includeDeleted?: boolean;
}
