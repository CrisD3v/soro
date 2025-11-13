import { PermissionResponseDto } from '@context/permission/application/dto/permission-response.dto';
import { GetPermissionUseCase } from '@context/permission/application/use-cases/get-permission.use-case';
import { ListPermissionsUseCase } from '@context/permission/application/use-cases/list-permissions.use-case';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { PermissionScope } from '@prisma/client';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly listPermissionsUseCase: ListPermissionsUseCase,
    private readonly getPermissionUseCase: GetPermissionUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('resource') resource?: string,
    @Query('action') action?: string,
    @Query('scope') scope?: PermissionScope,
  ): Promise<PermissionResponseDto[]> {
    const permissions = await this.listPermissionsUseCase.execute({
      resource,
      action,
      scope,
    });
    return permissions.map((p) => PermissionResponseDto.fromEntity(p));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PermissionResponseDto> {
    const permission = await this.getPermissionUseCase.execute(id);
    return PermissionResponseDto.fromEntity(permission);
  }
}
