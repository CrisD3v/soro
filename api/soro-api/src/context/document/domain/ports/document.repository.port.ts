import { DocumentEntity } from '../entities/document.entity';

export interface DocumentRepositoryPort {
  create(document: Partial<DocumentEntity>): Promise<DocumentEntity>;
  findById(id: string, companyId: string): Promise<DocumentEntity | null>;
  findByProject(projectId: string, companyId: string): Promise<DocumentEntity[]>;
  findByCompany(companyId: string): Promise<DocumentEntity[]>;
  update(id: string, companyId: string, data: Partial<DocumentEntity>): Promise<DocumentEntity>;
  delete(id: string, companyId: string): Promise<void>;
}
