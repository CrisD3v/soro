import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'user.created', description: 'Event type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'User', description: 'Entity name' })
  @IsString()
  @IsNotEmpty()
  entity: string;

  @ApiProperty({ example: 'uuid', description: 'Entity ID' })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ example: { email: 'user@example.com' }, description: 'Event payload' })
  @IsObject()
  payload: Record<string, any>;

  @ApiProperty({ example: 'pending', description: 'Event status', required: false })
  @IsString()
  @IsOptional()
  @IsIn(['pending', 'processing', 'completed', 'failed'])
  status?: string;
}
