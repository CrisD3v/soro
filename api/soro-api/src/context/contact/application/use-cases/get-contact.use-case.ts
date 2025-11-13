import { Contact } from '@context/contact/domain/entities/contact.entity';
import { ContactRepositoryPort } from '@context/contact/domain/ports/contact.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetContactUseCase {
  constructor(private readonly contactRepository: ContactRepositoryPort) {}

  async execute(contactId: string): Promise<Contact> {
    const contact = await this.contactRepository.findById(contactId);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }
}
