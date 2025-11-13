import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Nueva tarea asignada' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Se te ha asignado la tarea "Implementar feature X"' })
  @IsString()
  message: string;

  @ApiProperty({
    example: 'task',
    enum: ['task', 'project', 'invoice', 'deal', 'system']
  })
  @IsEnum(['task', 'project', 'invoice', 'deal', 'system'])
  type: string;

  @ApiPropertyOptional({ example: 'task' })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({ example: 'uuid-task-id' })
  @IsOptional()
  @IsString()
  entityId?: string;
}
