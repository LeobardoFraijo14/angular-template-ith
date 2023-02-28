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
import { RolesService } from './roles.service';

//Dtos
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDto } from './dto/role.dto';
import { PermissionRolesDto } from './dto/permission-roles.dto';
import { PageDto } from '../common/dtos/page.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { RelationsOptionsDto } from '../common/dtos/relations-options.dto';

//Decorator
import { Permissions } from '../common/decorators/commons.decorator';

//Interfaces
import { TypePermissions } from '../common/interfaces/commons.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions(TypePermissions.CREATE_ROLE)
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions(TypePermissions.GET_ROLES)
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() relations?: RelationsOptionsDto,
  ): Promise<PageDto<RoleDto>> {
    return this.rolesService.findAll(pageOptionsDto, relations);
  }

  @Get(':id')
  @Permissions(TypePermissions.GET_ROLES)
  findOne(@Param('id') id: string): Promise<RoleDto> {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id/editar')
  @Permissions(TypePermissions.EDIT_ROLE)
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDto> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id/eliminar')
  @Permissions(TypePermissions.DEACTIVATE_ROLE)
  remove(@Param('id') id: string): Promise<RoleDto> {
    return this.rolesService.remove(+id);
  }

  @Patch(':id/activar')
  @Permissions(TypePermissions.ACTIVATE_ROLE)
  active(@Param('id') id: string): Promise<RoleDto> {
    return this.rolesService.active(+id);
  }

  @Post(':id/permisos')
  @Permissions(TypePermissions.ADD_PERMISSIONS)
  async renovatePermissionsToRole(
    @Param('id') id: string,
    @Body() permissionRoleDto: PermissionRolesDto,
  ): Promise<RoleDto> {
    return this.rolesService.setPermissions(+id, permissionRoleDto);
  }

  // @Post('permisos')
  // async addPermissionsToRole(
  //   @Body() addPermissionsToRoleDto: PermissionRolesDto,
  // ): Promise<RoleDto> {
  //   const roleDto = await this.rolesService.addPermissions(
  //     addPermissionsToRoleDto,
  //   );
  //   return roleDto;
  // }

  // @Post('permisos/borrar')
  // async deleteRoles(
  //   @Body() deletePermissions: PermissionRolesDto,
  // ): Promise<RoleDto> {
  //   const roleDto = await this.rolesService.deletePermissions(
  //     deletePermissions,
  //   );
  //   return roleDto;
  // }
}
