import { Contact } from '../entities/contact.entity';

export interface CreateContactData {
  companyId: string;
  type: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  customData?: Record<string, any>;
  createdBy: string;
}

export interface UpdateContactData {
  type?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  customData?: Record<string, any>;
}

export interface ListContactsFilters {
  companyId?: string;
  type?: string;
  email?: string;
  createdBy?: string;
}

export abstract class ContactRepositoryPort {
  abstract create(data: CreateContactData): Promise<Contact>;
  abstract findById(id: string): Promise<Contact | null>;
  abstract update(id: string, data: UpdateContactData): Promise<Contact>;
  abstract delete(id: string): Promise<void>;
  abstract list(filters?: ListContactsFilters): Promise<Contact[]>;
}
