import { ContactRepositoryPort } from '@context/contact/domain/ports/contact.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteContactUseCase {
  constructor(private readonly contactRepository: ContactRepositoryPort) {}

  async execute(contactId: string): Promise<void> {
    const contact = await this.contactRepository.findById(contactId);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.contactRepository.delete(contactId);
  }
}
