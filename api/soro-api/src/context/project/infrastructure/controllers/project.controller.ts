import { CreateProjectDto } from '@context/project/application/dto/create-project.dto';
import { ProjectResponseDto } from '@context/project/application/dto/project-response.dto';
import { UpdateProjectDto } from '@context/project/application/dto/update-project.dto';
import { CreateProjectUseCase } from '@context/project/application/use-cases/create-project.use-case';
import { DeleteProjectUseCase } from '@context/project/application/use-cases/delete-project.use-case';
import { GetProjectUseCase } from '@context/project/application/use-cases/get-project.use-case';
import { ListProjectsUseCase } from '@context/project/application/use-cases/list-projects.use-case';
import { UpdateProjectUseCase } from '@context/project/application/use-cases/update-project.use-case';
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
  Request,
} from '@nestjs/common';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
    private readonly listProjectsUseCase: ListProjectsUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateProjectDto,
    @Request() req: any,
  ): Promise<ProjectResponseDto> {
    const project = await this.createProjectUseCase.execute(dto, req.user?.sub);
    return ProjectResponseDto.fromEntity(project);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    const project = await this.getProjectUseCase.execute(id);
    return ProjectResponseDto.fromEntity(project);
  }

  @Get()
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('status') status?: string,
    @Query('createdBy') createdBy?: string,
  ): Promise<ProjectResponseDto[]> {
    const projects = await this.listProjectsUseCase.execute({
      companyId,
      status,
      createdBy,
    });
    return projects.map((project) => ProjectResponseDto.fromEntity(project));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.updateProjectUseCase.execute(id, dto);
    return ProjectResponseDto.fromEntity(project);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteProjectUseCase.execute(id);
  }
}
