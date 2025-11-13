import { Deal } from '@context/deal/domain/entities/deal.entity';
import {
  DealRepositoryPort,
  ListDealsFilters,
} from '@context/deal/domain/ports/deal.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListDealsUseCase {
  constructor(private readonly dealRepository: DealRepositoryPort) {}

  async execute(filters?: ListDealsFilters): Promise<Deal[]> {
    return await this.dealRepository.list(filters);
  }
}
