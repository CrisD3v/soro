import { Company } from '@context/company/domain/entities/company.entity';
import {
  CompanyRepositoryPort,
  CreateCompanyData,
  ListCompaniesFilters,
  UpdateCompanyData,
} from '@context/company/domain/ports/company.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CompanyMapper } from '../mappers/company.mapper';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyData): Promise<Company> {
    const company = await this.prisma.company.create({
      data: {
        name: data.name,
        nit: data.nit,
        address: data.address,
        phone: data.phone,
        parentId: data.parentId,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return CompanyMapper.toDomain(company);
  }

  async findById(id: string, includeDeleted = false): Promise<Company | null> {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      include: {
        parent: true,
        children: {
          where: includeDeleted ? {} : { deletedAt: null },
        },
      },
    });

    return company ? CompanyMapper.toDomain(company) : null;
  }

  async findByNit(
    nit: string,
    includeDeleted = false,
  ): Promise<Company | null> {
    const company = await this.prisma.company.findFirst({
      where: {
        nit,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return company ? CompanyMapper.toDomain(company) : null;
  }

  async update(id: string, data: UpdateCompanyData): Promise<Company> {
    const company = await this.prisma.company.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
      },
    });

    return CompanyMapper.toDomain(company);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.company.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<void> {
    await this.prisma.company.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async list(filters?: ListCompaniesFilters): Promise<Company[]> {
    const where: any = {};

    if (!filters?.includeDeleted) {
      where.deletedAt = null;
    }

    if (filters?.parentId !== undefined) {
      where.parentId = filters.parentId;
    }

    if (filters?.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    const companies = await this.prisma.company.findMany({
      where,
      include: {
        parent: true,
        children: {
          where: filters?.includeDeleted ? {} : { deletedAt: null },
        },
      },
      orderBy: { name: 'asc' },
    });

    return CompanyMapper.toDomainList(companies);
  }

  async findChildren(
    parentId: string,
    includeDeleted = false,
  ): Promise<Company[]> {
    const companies = await this.prisma.company.findMany({
      where: {
        parentId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      include: {
        parent: true,
        children: true,
      },
      orderBy: { name: 'asc' },
    });

    return CompanyMapper.toDomainList(companies);
  }

  async findHierarchy(companyId: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        parent: true,
        children: {
          where: { deletedAt: null },
          include: {
            children: {
              where: { deletedAt: null },
              include: {
                children: {
                  where: { deletedAt: null },
                },
              },
            },
          },
        },
      },
    });

    if (!company) {
      throw new Error('Company not found');
    }

    return CompanyMapper.toDomain(company);
  }
}
