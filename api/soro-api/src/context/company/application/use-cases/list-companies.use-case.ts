import { Company } from '@context/company/domain/entities/company.entity';
import {
  CompanyRepositoryPort,
  ListCompaniesFilters,
} from '@context/company/domain/ports/company.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListCompaniesUseCase {
  constructor(private readonly companyRepository: CompanyRepositoryPort) {}

  async execute(filters?: ListCompaniesFilters): Promise<Company[]> {
    return await this.companyRepository.list(filters);
  }
}
