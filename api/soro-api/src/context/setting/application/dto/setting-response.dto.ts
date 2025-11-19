import { SettingCategory } from '@context/setting/domain/entities/setting.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SettingResponseDto {
  @ApiProperty({
    description: 'ID de la configuración',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Clave única de la configuración',
    example: 'app.theme',
  })
  key: string;

  @ApiProperty({
    description: 'Valor de la configuración',
    example: 'dark',
  })
  value: string;

  @ApiPropertyOptional({
    description: 'Descripción de la configuración',
    example: 'Tema de la aplicación',
  })
  description?: string;

  @ApiProperty({
    description: 'Categoría de la configuración',
    enum: SettingCategory,
    example: SettingCategory.APPEARANCE,
  })
  category: SettingCategory;

  @ApiProperty({
    description: 'Si la configuración es pública',
    example: false,
  })
  isPublic: boolean;

  @ApiProperty({
    description: 'ID de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  companyId: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-11-19T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-11-19T10:00:00.000Z',
  })
  updatedAt: Date;
}
