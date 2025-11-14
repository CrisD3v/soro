import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty({ example: 'uuid', description: 'Company ID' })
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({ example: 'Send welcome email', description: 'Workflow name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Sends welcome email to new users', description: 'Workflow description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'event-based', description: 'Trigger type' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['manual', 'scheduled', 'event-based'])
  trigger: string;

  @ApiProperty({ example: { event: 'user.created' }, description: 'Trigger configuration', required: false })
  @IsObject()
  @IsOptional()
  triggerConfig?: Record<string, any>;

  @ApiProperty({ example: true, description: 'Is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 'uuid', description: 'Creator user ID' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
