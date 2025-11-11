import { AssignRoleDto } from '@context/user/application/dto/assign-role.dto';
import { AssignSignatureDto } from '@context/user/application/dto/assign-signature.dto';
import { CreateUserDto } from '@context/user/application/dto/create-user.dto';
import { UpdateUserDto } from '@context/user/application/dto/update-user.dto';
import { UserResponseDto } from '@context/user/application/dto/user-response.dto';
import { AssignRoleUseCase } from '@context/user/application/use-cases/assign-role.use-case';
import { AssignSignatureUseCase } from '@context/user/application/use-cases/assign-signature.use-case';
import { CreateUserUseCase } from '@context/user/application/use-cases/create-user.use-case';
import { GetUserUseCase } from '@context/user/application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '@context/user/application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '@context/user/application/use-cases/update-user.use-case';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly assignRoleUseCase: AssignRoleUseCase,
    private readonly assignSignatureUseCase: AssignSignatureUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(dto);
    return UserResponseDto.fromEntity(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserUseCase.execute(id);
    return UserResponseDto.fromEntity(user);
  }

  @Get()
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('email') email?: string,
    @Query('documentNumber') documentNumber?: string,
  ): Promise<UserResponseDto[]> {
    const users = await this.listUsersUseCase.execute({
      companyId,
      email,
      documentNumber,
    });
    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.updateUserUseCase.execute(id, dto);
    return UserResponseDto.fromEntity(user);
  }

  @Post(':id/roles')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignRole(
    @Param('id') id: string,
    @Body() dto: AssignRoleDto,
  ): Promise<void> {
    await this.assignRoleUseCase.execute(id, dto);
  }

  @Post(':id/signature')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignSignature(
    @Param('id') id: string,
    @Body() dto: AssignSignatureDto,
  ): Promise<void> {
    await this.assignSignatureUseCase.execute(id, dto);
  }
}
