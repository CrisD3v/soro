import { Company } from '@context/company/domain/entities/company.entity';
import { CompanyRepositoryPort } from '@context/company/domain/ports/company.repository.port';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/create-company.dto';

@Injectable()
export class CreateCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepositoryPort) { }

  async execute(dto: CreateCompanyDto): Promise<Company> {
    // Verificar si el NIT ya existe
    const existingNit = await this.companyRepository.findByNit(dto.nit);
    if (existingNit) {
      throw new ConflictException('NIT already exists');
    }

    // Si tiene parentId, verificar que el padre existe
    if (dto.parentId) {
      const parent = await this.companyRepository.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException('Parent company not found');
      }
      if (parent.isDeleted()) {
        throw new ConflictException('Parent company is deleted');
      }
    }

    return await this.companyRepository.create(dto);
  }
}
