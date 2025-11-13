import { DealRepositoryPort } from '@context/deal/domain/ports/deal.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteDealUseCase {
  constructor(private readonly dealRepository: DealRepositoryPort) {}

  async execute(dealId: string): Promise<void> {
    const deal = await this.dealRepository.findById(dealId);

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    await this.dealRepository.delete(dealId);
  }
}
