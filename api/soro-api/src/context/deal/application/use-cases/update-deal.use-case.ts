import { Deal } from '@context/deal/domain/entities/deal.entity';
import { DealRepositoryPort } from '@context/deal/domain/ports/deal.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateDealDto } from '../dto/update-deal.dto';

@Injectable()
export class UpdateDealUseCase {
  constructor(private readonly dealRepository: DealRepositoryPort) {}

  async execute(dealId: string, dto: UpdateDealDto): Promise<Deal> {
    const deal = await this.dealRepository.findById(dealId);

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return await this.dealRepository.update(dealId, {
      ...dto,
      expectedCloseDate: dto.expectedCloseDate
        ? new Date(dto.expectedCloseDate)
        : undefined,
    });
  }
}
