import { Company } from '@context/company/domain/entities/company.entity';
import { CompanyRepositoryPort } from '@context/company/domain/ports/company.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetCompanyHierarchyUseCase {
  constructor(private readonly companyRepository: CompanyRepositoryPort) {}

  async execute(companyId: string): Promise<Company> {
    const company = await this.companyRepository.findHierarchy(companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }
}
