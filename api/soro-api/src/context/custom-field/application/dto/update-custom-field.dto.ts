import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateCustomFieldDto {
  @ApiProperty({ example: 'customField1', description: 'Field name', required: false })
  @IsString()
  @IsOptional()
  fieldName?: string;

  @ApiProperty({ example: 'text', description: 'Field type', required: false })
  @IsString()
  @IsOptional()
  @IsIn(['text', 'number', 'date', 'select', 'boolean', 'email', 'phone'])
  fieldType?: string;

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
