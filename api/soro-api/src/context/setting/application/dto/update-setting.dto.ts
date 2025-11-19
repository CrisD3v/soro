import { SettingCategory } from '@context/setting/domain/entities/setting.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiPropertyOptional({
    description: 'Valor de la configuración',
    example: 'light',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    description: 'Descripción de la configuración',
    example: 'Tema de la aplicación actualizado',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Categoría de la configuración',
    enum: SettingCategory,
    example: SettingCategory.APPEARANCE,
  })
  @IsOptional()
  @IsEnum(SettingCategory)
  category?: SettingCategory;

  @ApiPropertyOptional({
    description: 'Si la configuración es pública',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
