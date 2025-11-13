import { Company } from '@context/company/domain/entities/company.entity';
import { Company as PrismaCompany } from '@prisma/client';

type PrismaCompanyWithRelations = PrismaCompany & {
  parent?: PrismaCompany | null;
  children?: PrismaCompany[];
};

export class CompanyMapper {
  static toDomain(prismaCompany: PrismaCompanyWithRelations): Company {
    const parent = prismaCompany.parent
      ? this.toDomain(prismaCompany.parent)
      : undefined;

    const children = prismaCompany.children
      ? prismaCompany.children.map((child) => this.toDomain(child))
      : undefined;

    return new Company(
      prismaCompany.id,
      prismaCompany.name,
      prismaCompany.nit,
      prismaCompany.address,
      prismaCompany.phone,
      prismaCompany.parentId,
      prismaCompany.deletedAt,
      prismaCompany.createdAt,
      prismaCompany.updatedAt,
      parent,
      children,
    );
  }

  static toDomainList(
    prismaCompanies: PrismaCompanyWithRelations[],
  ): Company[] {
    return prismaCompanies.map((company) => this.toDomain(company));
  }
}
