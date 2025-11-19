import { SettingCategory } from '@context/setting/domain/entities/setting.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({
    description: 'Clave única de la configuración',
    example: 'app.theme',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  key: string;

  @ApiProperty({
    description: 'Valor de la configuración',
    example: 'dark',
  })
  @IsString()
  value: string;

  @ApiPropertyOptional({
    description: 'Descripción opcional de la configuración',
    example: 'Tema de la aplicación',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Categoría de la configuración',
    enum: SettingCategory,
    example: SettingCategory.APPEARANCE,
  })
  @IsEnum(SettingCategory)
  category: SettingCategory;

  @ApiPropertyOptional({
    description: 'Si la configuración es pública (visible para todos los usuarios)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({
    description: 'ID de la empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  companyId: string;
}
