import {
  Signature,
  User,
  UserRole,
} from '@context/user/domain/entities/user.entity';
import { DocumentType } from '@context/user/domain/value-objects/document.vo';
import {
  Signature as PrismaSignature,
  User as PrismaUser,
  UserRole as PrismaUserRole,
} from '@prisma/client';

type PrismaUserWithRelations = PrismaUser & {
  roles?: PrismaUserRole[];
  signature?: PrismaSignature | null;
};

export class UserMapper {
  static toDomain(prismaUser: PrismaUserWithRelations): User {
    const roles: UserRole[] | undefined = prismaUser.roles?.map((role) => ({
      id: role.id,
      roleId: role.roleId,
      companyId: role.companyId,
      createdAt: role.createdAt,
    }));

    const signature: Signature | undefined = prismaUser.signature
      ? {
          id: prismaUser.signature.id,
          signature: prismaUser.signature.signature,
          createdAt: prismaUser.signature.createdAt,
          updatedAt: prismaUser.signature.updatedAt,
        }
      : undefined;

    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.password,
      prismaUser.name,
      prismaUser.lastName,
      prismaUser.documentNumber,
      prismaUser.documentType as DocumentType,
      prismaUser.phone,
      prismaUser.companyId,
      roles,
      signature,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }

  static toDomainList(prismaUsers: PrismaUserWithRelations[]): User[] {
    return prismaUsers.map((user) => this.toDomain(user));
  }
}
