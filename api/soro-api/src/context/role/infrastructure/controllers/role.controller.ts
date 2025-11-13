import { AssignPermissionDto } from '@context/role/application/dto/assign-permission.dto';
import { CreateRoleDto } from '@context/role/application/dto/create-role.dto';
import {
  PermissionResponseDto,
  RoleResponseDto,
} from '@context/role/application/dto/role-response.dto';
import { UpdateRoleDto } from '@context/role/application/dto/update-role.dto';
import { AssignPermissionUseCase } from '@context/role/application/use-cases/assign-permission.use-case';
import { CreateRoleUseCase } from '@context/role/application/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from '@context/role/application/use-cases/delete-role.use-case';
import { GetRolePermissionsUseCase } from '@context/role/application/use-cases/get-role-permissions.use-case';
import { GetRoleUseCase } from '@context/role/application/use-cases/get-role.use-case';
import { ListRolesUseCase } from '@context/role/application/use-cases/list-roles.use-case';
import { RemovePermissionUseCase } from '@context/role/application/use-cases/remove-permission.use-case';
import { UpdateRoleUseCase } from '@context/role/application/use-cases/update-role.use-case';
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
} from '@nestjs/common';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly assignPermissionUseCase: AssignPermissionUseCase,
    private readonly removePermissionUseCase: RemovePermissionUseCase,
    private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = await this.createRoleUseCase.execute(dto);
    return RoleResponseDto.fromEntity(role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoleResponseDto> {
    const role = await this.getRoleUseCase.execute(id);
    return RoleResponseDto.fromEntity(role);
  }

  @Get()
  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.listRolesUseCase.execute();
    return roles.map((role) => RoleResponseDto.fromEntity(role));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const role = await this.updateRoleUseCase.execute(id, dto);
    return RoleResponseDto.fromEntity(role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteRoleUseCase.execute(id);
  }

  @Post(':id/permissions')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignPermission(
    @Param('id') id: string,
    @Body() dto: AssignPermissionDto,
  ): Promise<void> {
    await this.assignPermissionUseCase.execute(id, dto);
  }

  @Delete(':id/permissions/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string,
  ): Promise<void> {
    await this.removePermissionUseCase.execute(id, permissionId);
  }

  @Get(':id/permissions')
  async getPermissions(
    @Param('id') id: string,
  ): Promise<PermissionResponseDto[]> {
    const permissions = await this.getRolePermissionsUseCase.execute(id);
    return permissions.map((p) => PermissionResponseDto.fromEntity(p));
  }
}
