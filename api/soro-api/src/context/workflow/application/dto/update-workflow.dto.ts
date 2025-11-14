import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateWorkflowDto {
  @ApiProperty({ example: 'Send welcome email', description: 'Workflow name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Sends welcome email to new users', description: 'Workflow description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'event-based', description: 'Trigger type', required: false })
  @IsString()
  @IsOptional()
  @IsIn(['manual', 'scheduled', 'event-based'])
  trigger?: string;

  @ApiProperty({ example: { event: 'user.created' }, description: 'Trigger configuration', required: false })
  @IsObject()
  @IsOptional()
  triggerConfig?: Record<string, any>;

  @ApiProperty({ example: true, description: 'Is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
