import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user.created' })
  type: string;

  @ApiProperty({ example: 'User' })
  entity: string;

  @ApiProperty({ example: 'uuid' })
  entityId: string;

  @ApiProperty({ example: { email: 'user@example.com' } })
  payload: Record<string, any>;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', nullable: true })
  processedAt: Date | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}
