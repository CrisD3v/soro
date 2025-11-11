import { CompanyRepositoryPort } from '@context/company/domain/ports/company.repository.port';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RestoreCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepositoryPort) { }

  async execute(companyId: string): Promise<void> {
    const company = await this.companyRepository.findById(companyId, true);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (!company.isDeleted()) {
      throw new ConflictException('Company is not deleted');
    }

    await this.companyRepository.restore(companyId);
  }
}
