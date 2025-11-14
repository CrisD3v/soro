import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateWorkflowDto } from '../../application/dto/create-workflow.dto';
import { UpdateWorkflowDto } from '../../application/dto/update-workflow.dto';
import { WorkflowResponseDto } from '../../application/dto/workflow-response.dto';
import { CreateWorkflowUseCase } from '../../application/use-cases/create-workflow.use-case';
import { DeleteWorkflowUseCase } from '../../application/use-cases/delete-workflow.use-case';
import { ListWorkflowsUseCase } from '../../application/use-cases/list-workflows.use-case';
import { UpdateWorkflowUseCase } from '../../application/use-cases/update-workflow.use-case';
import { WorkflowMapper } from '../mappers/workflow.mapper';

@ApiTags('Workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowController {
  constructor(
    private readonly createWorkflowUseCase: CreateWorkflowUseCase,
    private readonly listWorkflowsUseCase: ListWorkflowsUseCase,
    private readonly updateWorkflowUseCase: UpdateWorkflowUseCase,
    private readonly deleteWorkflowUseCase: DeleteWorkflowUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a workflow' })
  @ApiResponse({ status: 201, description: 'Workflow created', type: WorkflowResponseDto })
  async create(@Body() dto: CreateWorkflowDto): Promise<WorkflowResponseDto> {
    const workflow = await this.createWorkflowUseCase.execute(dto);
    return WorkflowMapper.toResponse(workflow);
  }

  @Get()
  @ApiOperation({ summary: 'List workflows by company' })
  @ApiResponse({ status: 200, description: 'Workflows list', type: [WorkflowResponseDto] })
  async list(@Query('companyId') companyId: string): Promise<WorkflowResponseDto[]> {
    const workflows = await this.listWorkflowsUseCase.execute(companyId);
    return workflows.map(WorkflowMapper.toResponse);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workflow' })
  @ApiResponse({ status: 200, description: 'Workflow updated', type: WorkflowResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowDto,
  ): Promise<WorkflowResponseDto> {
    const workflow = await this.updateWorkflowUseCase.execute(id, dto);
    return WorkflowMapper.toResponse(workflow);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow' })
  @ApiResponse({ status: 204, description: 'Workflow deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteWorkflowUseCase.execute(id);
  }
}
