import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateCustomFieldDto } from '../../application/dto/create-custom-field.dto';
import { CustomFieldResponseDto } from '../../application/dto/custom-field-response.dto';
import { UpdateCustomFieldDto } from '../../application/dto/update-custom-field.dto';
import { CreateCustomFieldUseCase } from '../../application/use-cases/create-custom-field.use-case';
import { DeleteCustomFieldUseCase } from '../../application/use-cases/delete-custom-field.use-case';
import { ListCustomFieldsUseCase } from '../../application/use-cases/list-custom-fields.use-case';
import { UpdateCustomFieldUseCase } from '../../application/use-cases/update-custom-field.use-case';
import { CustomFieldMapper } from '../mappers/custom-field.mapper';

@ApiTags('Custom Fields')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('custom-fields')
export class CustomFieldController {
  constructor(
    private readonly createCustomFieldUseCase: CreateCustomFieldUseCase,
    private readonly listCustomFieldsUseCase: ListCustomFieldsUseCase,
    private readonly updateCustomFieldUseCase: UpdateCustomFieldUseCase,
    private readonly deleteCustomFieldUseCase: DeleteCustomFieldUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a custom field' })
  @ApiResponse({ status: 201, description: 'Custom field created', type: CustomFieldResponseDto })
  async create(@Body() dto: CreateCustomFieldDto): Promise<CustomFieldResponseDto> {
    const field = await this.createCustomFieldUseCase.execute(dto);
    return CustomFieldMapper.toResponse(field);
  }

  @Get()
  @ApiOperation({ summary: 'List custom fields by company' })
  @ApiResponse({ status: 200, description: 'Custom fields list', type: [CustomFieldResponseDto] })
  async list(
    @Query('companyId') companyId: string,
    @Query('entity') entity?: string,
  ): Promise<CustomFieldResponseDto[]> {
    const fields = await this.listCustomFieldsUseCase.execute(companyId, entity);
    return fields.map(CustomFieldMapper.toResponse);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a custom field' })
  @ApiResponse({ status: 200, description: 'Custom field updated', type: CustomFieldResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomFieldDto,
  ): Promise<CustomFieldResponseDto> {
    const field = await this.updateCustomFieldUseCase.execute(id, dto);
    return CustomFieldMapper.toResponse(field);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a custom field' })
  @ApiResponse({ status: 204, description: 'Custom field deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCustomFieldUseCase.execute(id);
  }
}
