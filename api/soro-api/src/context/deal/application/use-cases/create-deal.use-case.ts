import { Deal } from '@context/deal/domain/entities/deal.entity';
import { DealRepositoryPort } from '@context/deal/domain/ports/deal.repository.port';
import { Injectable } from '@nestjs/common';
import { CreateDealDto } from '../dto/create-deal.dto';

@Injectable()
export class CreateDealUseCase {
  constructor(private readonly dealRepository: DealRepositoryPort) {}

  async execute(dto: CreateDealDto, userId: string): Promise<Deal> {
    return await this.dealRepository.create({
      ...dto,
      createdBy: userId,
      expectedCloseDate: dto.expectedCloseDate
        ? new Date(dto.expectedCloseDate)
        : undefined,
    });
  }
}
