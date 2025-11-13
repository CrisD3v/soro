import { Contact } from '@context/contact/domain/entities/contact.entity';
import { Contact as PrismaContact } from '@prisma/client';

export class ContactMapper {
  static toDomain(prismaContact: PrismaContact): Contact {
    return new Contact(
      prismaContact.id,
      prismaContact.companyId,
      prismaContact.type,
      prismaContact.name,
      prismaContact.email,
      prismaContact.phone,
      prismaContact.address,
      prismaContact.notes,
      prismaContact.customData as Record<string, any>,
      prismaContact.createdBy,
      prismaContact.createdAt,
      prismaContact.updatedAt,
    );
  }

  static toDomainList(prismaContacts: PrismaContact[]): Contact[] {
    return prismaContacts.map((contact) => this.toDomain(contact));
  }
}
