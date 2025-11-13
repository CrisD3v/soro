import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateCompanyUseCase } from './application/use-cases/create-company.use-case';
import { DeleteCompanyUseCase } from './application/use-cases/delete-company.use-case';
import { GetCompanyHierarchyUseCase } from './application/use-cases/get-company-hierarchy.use-case';
import { GetCompanyUseCase } from './application/use-cases/get-company.use-case';
import { ListCompaniesUseCase } from './application/use-cases/list-companies.use-case';
import { RestoreCompanyUseCase } from './application/use-cases/restore-company.use-case';
import { UpdateCompanyUseCase } from './application/use-cases/update-company.use-case';
import { CompanyRepositoryPort } from './domain/ports/company.repository.port';
import { CompanyController } from './infrastructure/controllers/company.controller';
import { PrismaCompanyRepository } from './infrastructure/persistence/prisma-company.repository';

@Module({
  controllers: [CompanyController],
  providers: [
    PrismaService,
    PrismaCompanyRepository,
    {
      provide: CompanyRepositoryPort,
      useClass: PrismaCompanyRepository,
    },
    CreateCompanyUseCase,
    UpdateCompanyUseCase,
    GetCompanyUseCase,
    ListCompaniesUseCase,
    DeleteCompanyUseCase,
    RestoreCompanyUseCase,
    GetCompanyHierarchyUseCase,
  ],
  exports: [CompanyRepositoryPort],
})
export class CompanyModule {}
