import { Contact } from '@context/contact/domain/entities/contact.entity';
import {
  ContactRepositoryPort,
  ListContactsFilters,
} from '@context/contact/domain/ports/contact.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListContactsUseCase {
  constructor(private readonly contactRepository: ContactRepositoryPort) {}

  async execute(filters?: ListContactsFilters): Promise<Contact[]> {
    return await this.contactRepository.list(filters);
  }
}
