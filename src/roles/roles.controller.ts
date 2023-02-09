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
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { RoleDto } from './dto/role.dto';
import { RelationsOptionsDto } from 'src/common/dtos/relations-options.dto';
import { PermissionRolesDto } from './dto/permission-roles.dto';
import { PageDto } from '../common/dtos/page.dto';

@Controller('')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() relations?: RelationsOptionsDto,
  ): Promise<PageDto<RoleDto>> {
    return this.rolesService.findAll(pageOptionsDto, relations);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<RoleDto> {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id/editar')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDto> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id/eliminar')
  remove(@Param('id') id: string): Promise<RoleDto> {
    return this.rolesService.remove(+id);
  }

  @Patch(':id/activar')
  active(@Param('id') id: string): Promise<RoleDto> {
    return this.rolesService.active(+id);
  }

  @Post(':id/permisos')
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
