import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCustomFieldDto {
  @ApiProperty({ example: 'uuid', description: 'Company ID' })
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({ example: 'Contact', description: 'Entity name' })
  @IsString()
  @IsNotEmpty()
  entity: string;

  @ApiProperty({ example: 'customField1', description: 'Field name' })
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @ApiProperty({ example: 'text', description: 'Field type' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['text', 'number', 'date', 'select', 'boolean', 'email', 'phone'])
  fieldType: string;

  @ApiProperty({ example: { options: ['Option 1', 'Option 2'] }, description: 'Field configuration', required: false })
  @IsObject()
  @IsOptional()
  fieldConfig?: Record<string, any>;

  @ApiProperty({ example: false, description: 'Is required', required: false })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiProperty({ example: true, description: 'Is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
