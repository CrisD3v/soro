import { Contact } from '@context/contact/domain/entities/contact.entity';
import { ContactRepositoryPort } from '@context/contact/domain/ports/contact.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateContactDto } from '../dto/update-contact.dto';

@Injectable()
export class UpdateContactUseCase {
  constructor(private readonly contactRepository: ContactRepositoryPort) {}

  async execute(contactId: string, dto: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactRepository.findById(contactId);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return await this.contactRepository.update(contactId, dto);
  }
}
