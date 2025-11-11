import { Company } from '@context/company/domain/entities/company.entity';

export class CompanyResponseDto {
  id: string;
  name: string;
  nit: string;
  address: string;
  phone: string;
  parentId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  parent?: CompanyResponseDto | null;
  children?: CompanyResponseDto[];

  static fromEntity(company: Company): CompanyResponseDto {
    const dto = new CompanyResponseDto();
    dto.id = company.id;
    dto.name = company.name;
    dto.nit = company.nit;
    dto.address = company.address;
    dto.phone = company.phone;
    dto.parentId = company.parentId;
    dto.deletedAt = company.deletedAt;
    dto.createdAt = company.createdAt;
    dto.updatedAt = company.updatedAt;

    if (company.parent) {
      dto.parent = CompanyResponseDto.fromEntity(company.parent);
    }

    if (company.children) {
      dto.children = company.children.map((child) =>
        CompanyResponseDto.fromEntity(child),
      );
    }

    return dto;
  }
}
