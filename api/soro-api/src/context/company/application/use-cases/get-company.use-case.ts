import { Company } from '@context/company/domain/entities/company.entity';
import { CompanyRepositoryPort } from '@context/company/domain/ports/company.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepositoryPort) {}

  async execute(companyId: string, includeDeleted = false): Promise<Company> {
    const company = await this.companyRepository.findById(
      companyId,
      includeDeleted,
    );

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }
}
