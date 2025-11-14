import { ApiProperty } from '@nestjs/swagger';

export class CustomFieldResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  companyId: string;

  @ApiProperty({ example: 'Contact' })
  entity: string;

  @ApiProperty({ example: 'customField1' })
  fieldName: string;

  @ApiProperty({ example: 'text' })
  fieldType: string;

  @ApiProperty({ example: {} })
  fieldConfig: Record<string, any>;

  @ApiProperty({ example: false })
  isRequired: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
