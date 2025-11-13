import { User } from '@context/user/domain/entities/user.entity';
import {
  AssignRoleData,
  AssignSignatureData,
  CreateUserData,
  ListUsersFilters,
  UpdateUserData,
  UserRepositoryPort,
} from '@context/user/domain/ports/user.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        lastName: data.lastName,
        documentNumber: data.documentNumber,
        documentType: data.documentType as any,
        phone: data.phone,
        companyId: data.companyId,
      },
      include: {
        roles: true,
        signature: true,
      },
    });

    return UserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
        signature: true,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
        signature: true,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByDocumentNumber(documentNumber: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { documentNumber },
      include: {
        roles: true,
        signature: true,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: {
        roles: true,
        signature: true,
      },
    });

    return UserMapper.toDomain(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async list(filters?: ListUsersFilters): Promise<User[]> {
    const where: any = {};

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }

    if (filters?.documentNumber) {
      where.documentNumber = filters.documentNumber;
    }

    const users = await this.prisma.user.findMany({
      where,
      include: {
        roles: true,
        signature: true,
      },
    });

    return UserMapper.toDomainList(users);
  }

  async assignRole(data: AssignRoleData): Promise<void> {
    await this.prisma.userRole.create({
      data: {
        userId: data.userId,
        roleId: data.roleId,
        companyId: data.companyId,
      },
    });
  }

  async removeRole(
    userId: string,
    roleId: string,
    companyId: string,
  ): Promise<void> {
    await this.prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
        companyId,
      },
    });
  }

  async assignSignature(data: AssignSignatureData): Promise<void> {
    await this.prisma.signature.create({
      data: {
        userId: data.userId,
        signature: data.signature,
      },
    });
  }

  async updateSignature(userId: string, signature: string): Promise<void> {
    await this.prisma.signature.update({
      where: { userId },
      data: { signature },
    });
  }
}
