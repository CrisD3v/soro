/**
 * Document API Types
 */

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  companyId: string;
  uploadedById: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentDto {
  name: string;
  url: string;
  type: string;
  size: number;
  companyId: string;
  uploadedById: string;
}

export interface UpdateDocumentDto {
  name?: string;
}

export interface DocumentFilters {
  companyId?: string;
  uploadedById?: string;
  type?: string;
  includeDeleted?: boolean;
}
