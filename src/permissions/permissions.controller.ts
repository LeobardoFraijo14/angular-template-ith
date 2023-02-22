import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

//Services
import { PermissionsService } from './permissions.service';

//Dtos
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionDto } from './dto/permission.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';

//Interfaces
import { TypePermissions } from '../common/interfaces/commons.interface';

//Decorators
import { Permissions } from '../common/decorators/commons.decorator';

@Controller('permisos')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Permissions(TypePermissions.CREATE_PERMISSION)
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDto> {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Permissions(TypePermissions.GET_LIST_PERMISSIONS)
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PermissionDto>> {
    return this.permissionsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Permissions(TypePermissions.GET_LIST_PERMISSIONS)
  findOne(@Param('id') id: string): Promise<PermissionDto> {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id/editar')
  @Permissions(TypePermissions.EDIT_PERMISSION)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionDto> {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id/eliminar')
  @Permissions(TypePermissions.DEACTIVATE_PERMISSION)
  remove(@Param('id') id: string): Promise<PermissionDto> {
    return this.permissionsService.remove(+id);
  }

  @Patch(':id/activar')
  @Permissions(TypePermissions.ACTIVATE_PERMISSION)
  active(@Param('id') id: string): Promise<PermissionDto> {
    return this.permissionsService.active(+id);
  }
}
