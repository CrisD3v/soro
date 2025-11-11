import { User } from '@context/user/domain/entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  lastName: string;
  fullName: string;
  documentNumber: string;
  documentType: string;
  phone: string;
  companyId: string;
  roles?: Array<{
    id: string;
    roleId: string;
    companyId: string;
    createdAt: Date;
  }>;
  signature?: {
    id: string;
    signature: string;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.lastName = user.lastName;
    dto.fullName = user.fullName;
    dto.documentNumber = user.documentNumber;
    dto.documentType = user.documentType;
    dto.phone = user.phone;
    dto.companyId = user.companyId;
    dto.roles = user.roles;
    dto.signature = user.signature;
    dto.createdAt = user.createdAt!;
    dto.updatedAt = user.updatedAt!;
    return dto;
  }
}
