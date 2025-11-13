import { CreateTaskDto } from '@context/task/application/dto/create-task.dto';
import { TaskResponseDto } from '@context/task/application/dto/task-response.dto';
import { UpdateTaskDto } from '@context/task/application/dto/update-task.dto';
import { CreateTaskUseCase } from '@context/task/application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '@context/task/application/use-cases/delete-task.use-case';
import { GetTaskUseCase } from '@context/task/application/use-cases/get-task.use-case';
import { ListTasksUseCase } from '@context/task/application/use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from '@context/task/application/use-cases/update-task.use-case';
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

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly listTasksUseCase: ListTasksUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Post('projects/:projectId/tasks')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.createTaskUseCase.execute(projectId, dto);
    return TaskResponseDto.fromEntity(task);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaskResponseDto> {
    const task = await this.getTaskUseCase.execute(id);
    return TaskResponseDto.fromEntity(task);
  }

  @Get()
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ): Promise<TaskResponseDto[]> {
    const tasks = await this.listTasksUseCase.execute({
      projectId,
      assignedTo,
      status,
      priority,
    });
    return tasks.map((task) => TaskResponseDto.fromEntity(task));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.updateTaskUseCase.execute(id, dto);
    return TaskResponseDto.fromEntity(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteTaskUseCase.execute(id);
  }
}
