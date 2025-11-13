import { Deal } from '@context/deal/domain/entities/deal.entity';

export class DealResponseDto {
  id: string;
  companyId: string;
  contactId: string;
  title: string;
  description: string | null;
  value: number;
  currency: string;
  stage: string;
  probability: number;
  expectedCloseDate: Date | null;
  closedAt: Date | null;
  assignedTo: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(deal: Deal): DealResponseDto {
    const dto = new DealResponseDto();
    dto.id = deal.id;
    dto.companyId = deal.companyId;
    dto.contactId = deal.contactId;
    dto.title = deal.title;
    dto.description = deal.description;
    dto.value = deal.value;
    dto.currency = deal.currency;
    dto.stage = deal.stage;
    dto.probability = deal.probability;
    dto.expectedCloseDate = deal.expectedCloseDate;
    dto.closedAt = deal.closedAt;
    dto.assignedTo = deal.assignedTo;
    dto.createdBy = deal.createdBy;
    dto.createdAt = deal.createdAt!;
    dto.updatedAt = deal.updatedAt!;
    return dto;
  }
}
