import { Contact } from '@context/contact/domain/entities/contact.entity';
import {
  ContactRepositoryPort,
  CreateContactData,
  ListContactsFilters,
  UpdateContactData,
} from '@context/contact/domain/ports/contact.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ContactMapper } from '../mappers/contact.mapper';

@Injectable()
export class PrismaContactRepository implements ContactRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateContactData): Promise<Contact> {
    const contact = await this.prisma.contact.create({
      data: {
        companyId: data.companyId,
        type: data.type || 'lead',
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        customData: data.customData || {},
        createdBy: data.createdBy,
      },
    });

    return ContactMapper.toDomain(contact);
  }

  async findById(id: string): Promise<Contact | null> {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    return contact ? ContactMapper.toDomain(contact) : null;
  }

  async update(id: string, data: UpdateContactData): Promise<Contact> {
    const contact = await this.prisma.contact.update({
      where: { id },
      data,
    });

    return ContactMapper.toDomain(contact);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.contact.delete({
      where: { id },
    });
  }

  async list(filters?: ListContactsFilters): Promise<Contact[]> {
    const where: any = {};

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }

    if (filters?.createdBy) {
      where.createdBy = filters.createdBy;
    }

    const contacts = await this.prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return ContactMapper.toDomainList(contacts);
  }
}
