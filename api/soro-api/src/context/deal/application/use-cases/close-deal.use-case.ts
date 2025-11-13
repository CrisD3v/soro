import { Deal } from '@context/deal/domain/entities/deal.entity';
import { DealRepositoryPort } from '@context/deal/domain/ports/deal.repository.port';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CloseDealUseCase {
  constructor(private readonly dealRepository: DealRepositoryPort) {}

  async execute(dealId: string, won: boolean): Promise<Deal> {
    const deal = await this.dealRepository.findById(dealId);

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    if (deal.isClosed()) {
      throw new ConflictException('Deal is already closed');
    }

    return await this.dealRepository.close(dealId, won);
  }
}
