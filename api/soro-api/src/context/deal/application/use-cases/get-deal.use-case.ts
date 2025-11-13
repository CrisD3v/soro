import { Deal } from '@context/deal/domain/entities/deal.entity';
import { DealRepositoryPort } from '@context/deal/domain/ports/deal.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetDealUseCase {
  constructor(private readonly dealRepository: DealRepositoryPort) {}

  async execute(dealId: string): Promise<Deal> {
    const deal = await this.dealRepository.findById(dealId);

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return deal;
  }
}
