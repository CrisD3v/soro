import { CompanyRepositoryPort } from '@context/company/domain/ports/company.repository.port';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepositoryPort) { }

  async execute(companyId: string): Promise<void> {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.isDeleted()) {
      throw new ConflictException('Company is already deleted');
    }

    await this.companyRepository.softDelete(companyId);
  }
}
