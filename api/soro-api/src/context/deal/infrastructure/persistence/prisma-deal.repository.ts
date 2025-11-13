import { Deal } from '@context/deal/domain/entities/deal.entity';
import {
  CreateDealData,
  DealRepositoryPort,
  ListDealsFilters,
  UpdateDealData,
} from '@context/deal/domain/ports/deal.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { DealMapper } from '../mappers/deal.mapper';

@Injectable()
export class PrismaDealRepository implements DealRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDealData): Promise<Deal> {
    const deal = await this.prisma.deal.create({
      data: {
        companyId: data.companyId,
        contactId: data.contactId,
        title: data.title,
        description: data.description,
        value: data.value,
        currency: data.currency || 'USD',
        stage: data.stage || 'prospecting',
        probability: data.probability || 0,
        expectedCloseDate: data.expectedCloseDate,
        assignedTo: data.assignedTo,
        createdBy: data.createdBy,
      },
    });

    return DealMapper.toDomain(deal);
  }

  async findById(id: string): Promise<Deal | null> {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });

    return deal ? DealMapper.toDomain(deal) : null;
  }

  async update(id: string, data: UpdateDealData): Promise<Deal> {
    const deal = await this.prisma.deal.update({
      where: { id },
      data: {
        ...data,
        expectedCloseDate: data.expectedCloseDate,
      },
    });

    return DealMapper.toDomain(deal);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.deal.delete({
      where: { id },
    });
  }

  async list(filters?: ListDealsFilters): Promise<Deal[]> {
    const where: any = {};

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.contactId) {
      where.contactId = filters.contactId;
    }

    if (filters?.stage) {
      where.stage = filters.stage;
    }

    if (filters?.assignedTo) {
      where.assignedTo = filters.assignedTo;
    }

    const deals = await this.prisma.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return DealMapper.toDomainList(deals);
  }

  async close(id: string, won: boolean): Promise<Deal> {
    const deal = await this.prisma.deal.update({
      where: { id },
      data: {
        stage: won ? 'closed_won' : 'closed_lost',
        probability: won ? 100 : 0,
        closedAt: new Date(),
      },
    });

    return DealMapper.toDomain(deal);
  }
}
