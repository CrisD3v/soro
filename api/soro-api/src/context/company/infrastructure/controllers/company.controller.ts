import { CompanyResponseDto } from '@context/company/application/dto/company-response.dto';
import { CreateCompanyDto } from '@context/company/application/dto/create-company.dto';
import { UpdateCompanyDto } from '@context/company/application/dto/update-company.dto';
import { CreateCompanyUseCase } from '@context/company/application/use-cases/create-company.use-case';
import { DeleteCompanyUseCase } from '@context/company/application/use-cases/delete-company.use-case';
import { GetCompanyHierarchyUseCase } from '@context/company/application/use-cases/get-company-hierarchy.use-case';
import { GetCompanyUseCase } from '@context/company/application/use-cases/get-company.use-case';
import { ListCompaniesUseCase } from '@context/company/application/use-cases/list-companies.use-case';
import { RestoreCompanyUseCase } from '@context/company/application/use-cases/restore-company.use-case';
import { UpdateCompanyUseCase } from '@context/company/application/use-cases/update-company.use-case';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyUseCase,
    private readonly getCompanyUseCase: GetCompanyUseCase,
    private readonly listCompaniesUseCase: ListCompaniesUseCase,
    private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
    private readonly restoreCompanyUseCase: RestoreCompanyUseCase,
    private readonly getCompanyHierarchyUseCase: GetCompanyHierarchyUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCompanyDto): Promise<CompanyResponseDto> {
    const company = await this.createCompanyUseCase.execute(dto);
    return CompanyResponseDto.fromEntity(company);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: string,
  ): Promise<CompanyResponseDto> {
    const company = await this.getCompanyUseCase.execute(
      id,
      includeDeleted === 'true',
    );
    return CompanyResponseDto.fromEntity(company);
  }

  @Get()
  async findAll(
    @Query('parentId') parentId?: string,
    @Query('name') name?: string,
    @Query('includeDeleted') includeDeleted?: string,
  ): Promise<CompanyResponseDto[]> {
    const companies = await this.listCompaniesUseCase.execute({
      parentId,
      name,
      includeDeleted: includeDeleted === 'true',
    });
    return companies.map((company) => CompanyResponseDto.fromEntity(company));
  }

  @Get(':id/hierarchy')
  async getHierarchy(@Param('id') id: string): Promise<CompanyResponseDto> {
    const company = await this.getCompanyHierarchyUseCase.execute(id);
    return CompanyResponseDto.fromEntity(company);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    const company = await this.updateCompanyUseCase.execute(id, dto);
    return CompanyResponseDto.fromEntity(company);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCompanyUseCase.execute(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: string): Promise<void> {
    await this.restoreCompanyUseCase.execute(id);
  }
}
