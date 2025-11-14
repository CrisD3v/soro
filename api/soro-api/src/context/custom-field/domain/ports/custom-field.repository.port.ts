import { CustomFieldEntity } from '../entities/custom-field.entity';

export interface CustomFieldRepositoryPort {
  create(field: {
    companyId: string;
    entity: string;
    fieldName: string;
    fieldType: string;
    fieldConfig: Record<string, any>;
    isRequired: boolean;
    isActive: boolean;
  }): Promise<CustomFieldEntity>;
  findById(id: string): Promise<CustomFieldEntity | null>;
  findByCompany(companyId: string): Promise<CustomFieldEntity[]>;
  findByEntity(companyId: string, entity: string): Promise<CustomFieldEntity[]>;
  update(id: string, data: Partial<CustomFieldEntity>): Promise<CustomFieldEntity>;
  delete(id: string): Promise<void>;
}
