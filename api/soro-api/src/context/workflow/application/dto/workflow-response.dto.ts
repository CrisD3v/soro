import { ApiProperty } from '@nestjs/swagger';

export class WorkflowResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  companyId: string;

  @ApiProperty({ example: 'Send welcome email' })
  name: string;

  @ApiProperty({ example: 'Sends welcome email to new users', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'event-based' })
  trigger: string;

  @ApiProperty({ example: { event: 'user.created' } })
  triggerConfig: Record<string, any>;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'uuid' })
  createdBy: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
