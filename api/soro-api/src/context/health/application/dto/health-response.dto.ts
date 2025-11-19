import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceHealthDto {
  @ApiProperty({ description: 'Nombre del servicio' })
  name: string;

  @ApiProperty({ description: 'Estado del servicio', enum: ['up', 'down', 'degraded'] })
  status: 'up' | 'down' | 'degraded';

  @ApiProperty({ description: 'Tiempo de respuesta en ms' })
  responseTime: number;

  @ApiProperty({ description: 'Última verificación' })
  lastCheck: string;

  @ApiPropertyOptional({ description: 'Mensaje adicional' })
  message?: string;

  @ApiPropertyOptional({ description: 'Detalles adicionales' })
  details?: Record<string, any>;
}

export class CPUHealthDto {
  @ApiProperty({ description: 'Uso de CPU en porcentaje' })
  usage: number;

  @ApiProperty({ description: 'Número de cores' })
  cores: number;

  @ApiProperty({ description: 'Modelo del procesador' })
  model: string;
}

export class MemoryHealthDto {
  @ApiProperty({ description: 'Memoria total en bytes' })
  total: number;

  @ApiProperty({ description: 'Memoria usada en bytes' })
  used: number;

  @ApiProperty({ description: 'Memoria libre en bytes' })
  free: number;

  @ApiProperty({ description: 'Porcentaje de uso' })
  usage: number;
}

export class DiskHealthDto {
  @ApiProperty({ description: 'Espacio total en bytes' })
  total: number;

  @ApiProperty({ description: 'Espacio usado en bytes' })
  used: number;

  @ApiProperty({ description: 'Espacio libre en bytes' })
  free: number;

  @ApiProperty({ description: 'Porcentaje de uso' })
  usage: number;
}

export class SystemHealthDto {
  @ApiProperty({ description: 'Información de CPU', type: CPUHealthDto })
  cpu: CPUHealthDto;

  @ApiProperty({ description: 'Información de memoria', type: MemoryHealthDto })
  memory: MemoryHealthDto;

  @ApiProperty({ description: 'Información de disco', type: DiskHealthDto })
  disk: DiskHealthDto;
}

export class HealthStatusResponseDto {
  @ApiProperty({ description: 'Estado general del sistema', enum: ['healthy', 'degraded', 'unhealthy'] })
  status: 'healthy' | 'degraded' | 'unhealthy';

  @ApiProperty({ description: 'Timestamp de la verificación' })
  timestamp: string;

  @ApiProperty({ description: 'Tiempo de actividad en segundos' })
  uptime: number;

  @ApiProperty({ description: 'Versión de la aplicación' })
  version: string;

  @ApiProperty({ description: 'Estado de los servicios', type: [ServiceHealthDto] })
  services: ServiceHealthDto[];

  @ApiProperty({ description: 'Estado del sistema', type: SystemHealthDto })
  system: SystemHealthDto;
}
