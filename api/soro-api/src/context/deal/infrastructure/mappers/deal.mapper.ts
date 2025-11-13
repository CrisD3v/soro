import { Deal } from '@context/deal/domain/entities/deal.entity';
import { Deal as PrismaDeal } from '@prisma/client';

export class DealMapper {
  static toDomain(prismaDeal: PrismaDeal): Deal {
    return new Deal(
      prismaDeal.id,
      prismaDeal.companyId,
      prismaDeal.contactId,
      prismaDeal.title,
      prismaDeal.description,
      prismaDeal.value,
      prismaDeal.currency,
      prismaDeal.stage,
      prismaDeal.probability,
      prismaDeal.expectedCloseDate,
      prismaDeal.closedAt,
      prismaDeal.assignedTo,
      prismaDeal.createdBy,
      prismaDeal.createdAt,
      prismaDeal.updatedAt,
    );
  }

  static toDomainList(prismaDeals: PrismaDeal[]): Deal[] {
    return prismaDeals.map((deal) => this.toDomain(deal));
  }
}
