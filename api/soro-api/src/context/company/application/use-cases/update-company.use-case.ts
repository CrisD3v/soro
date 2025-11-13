import { Company } from '@context/company/domain/entities/company.entity';
import { CompanyRepositoryPort } from '@context/company/domain/ports/company.repository.port';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@Injectable()
export class UpdateCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepositoryPort) {}

  async execute(companyId: string, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.isDeleted()) {
      throw new ConflictException('Cannot update deleted company');
    }

    // Si se actualiza el parentId, verificar que existe
    if (dto.parentId !== undefined) {
      if (dto.parentId === companyId) {
        throw new ConflictException('Company cannot be its own parent');
      }

      if (dto.parentId) {
        const parent = await this.companyRepository.findById(dto.parentId);
        if (!parent) {
          throw new NotFoundException('Parent company not found');
        }
        if (parent.isDeleted()) {
          throw new ConflictException('Parent company is deleted');
        }
      }
    }

    return await this.companyRepository.update(companyId, dto);
  }
}
