import { Contact } from '@context/contact/domain/entities/contact.entity';
import { ContactRepositoryPort } from '@context/contact/domain/ports/contact.repository.port';
import { Injectable } from '@nestjs/common';
import { CreateContactDto } from '../dto/create-contact.dto';

@Injectable()
export class CreateContactUseCase {
  constructor(private readonly contactRepository: ContactRepositoryPort) { }

  async execute(dto: CreateContactDto, userId: string): Promise<Contact> {
    return await this.contactRepository.create({
      type: dto.type || 'lead',
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      notes: dto.notes,
      createdBy: userId,
      customData: dto.customData || {},
      companyId: dto.companyId,
    });
  }
}
