import { Contact } from '@context/contact/domain/entities/contact.entity';

export class ContactResponseDto {
  id: string;
  companyId: string;
  type: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  customData: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(contact: Contact): ContactResponseDto {
    const dto = new ContactResponseDto();
    dto.id = contact.id;
    dto.companyId = contact.companyId;
    dto.type = contact.type;
    dto.name = contact.name;
    dto.email = contact.email;
    dto.phone = contact.phone;
    dto.address = contact.address;
    dto.notes = contact.notes;
    dto.customData = contact.customData;
    dto.createdBy = contact.createdBy;
    dto.createdAt = contact.createdAt!;
    dto.updatedAt = contact.updatedAt!;
    return dto;
  }
}
