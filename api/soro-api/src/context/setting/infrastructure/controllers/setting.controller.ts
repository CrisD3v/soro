import { CreateSettingDto } from '@context/setting/application/dto/create-setting.dto';
import { SettingResponseDto } from '@context/setting/application/dto/setting-response.dto';
import { UpdateSettingDto } from '@context/setting/application/dto/update-setting.dto';
import { CreateSettingUseCase } from '@context/setting/application/use-cases/create-setting.use-case';
import { DeleteSettingUseCase } from '@context/setting/application/use-cases/delete-setting.use-case';
import { GetSettingByKeyUseCase } from '@context/setting/application/use-cases/get-setting-by-key.use-case';
import { GetSettingUseCase } from '@context/setting/application/use-cases/get-setting.use-case';
import { ListSettingsUseCase } from '@context/setting/application/use-cases/list-settings.use-case';
import { UpdateSettingUseCase } from '@context/setting/application/use-cases/update-setting.use-case';
import { SettingCategory } from '@context/setting/domain/entities/setting.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Settings')
@Controller('settings')
export class SettingController {
  constructor(
    private readonly createSettingUseCase: CreateSettingUseCase,
    private readonly getSettingUseCase: GetSettingUseCase,
    private readonly getSettingByKeyUseCase: GetSettingByKeyUseCase,
    private readonly updateSettingUseCase: UpdateSettingUseCase,
    private readonly deleteSettingUseCase: DeleteSettingUseCase,
    private readonly listSettingsUseCase: ListSettingsUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva configuración' })
  @ApiResponse({
    status: 201,
    description: 'Configuración creada exitosamente',
    type: SettingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() dto: CreateSettingDto): Promise<SettingResponseDto> {
    return this.createSettingUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar configuraciones' })
  @ApiQuery({ name: 'companyId', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, enum: SettingCategory })
  @ApiQuery({ name: 'isPublic', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Lista de configuraciones',
    type: [SettingResponseDto],
  })
  async list(
    @Query('companyId') companyId?: string,
    @Query('category') category?: SettingCategory,
    @Query('isPublic') isPublic?: string,
    @Query('search') search?: string,
  ): Promise<SettingResponseDto[]> {
    return this.listSettingsUseCase.execute({
      companyId,
      category,
      isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
      search,
    });
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Obtener configuración por clave' })
  @ApiQuery({ name: 'companyId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Configuración encontrada',
    type: SettingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  async getByKey(
    @Param('key') key: string,
    @Query('companyId') companyId: string,
  ): Promise<SettingResponseDto> {
    return this.getSettingByKeyUseCase.execute(key, companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener configuración por ID' })
  @ApiResponse({
    status: 200,
    description: 'Configuración encontrada',
    type: SettingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  async getById(@Param('id') id: string): Promise<SettingResponseDto> {
    return this.getSettingUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración actualizada exitosamente',
    type: SettingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSettingDto,
  ): Promise<SettingResponseDto> {
    return this.updateSettingUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar configuración' })
  @ApiResponse({ status: 204, description: 'Configuración eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteSettingUseCase.execute(id);
  }
}
