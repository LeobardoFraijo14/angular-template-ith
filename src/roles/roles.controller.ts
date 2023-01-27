import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

//Services
import { RolesService } from './roles.service';

//Dtos
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { RoleDto } from './dto/role.dto';
import { RelationsOptionsDto } from 'src/common/dtos/relations-options.dto';
import { PermissionRolesDto } from './dto/permission-roles.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const roleDto = await this.rolesService.create(createRoleDto);
    return roleDto;
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto, @Query() relations?: RelationsOptionsDto) {
    const rolesDto = await this.rolesService.findAll(pageOptionsDto, relations);
    return rolesDto
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoleDto> {
    const roleDto = await this.rolesService.findOne(+id);
    return roleDto;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleDto> {
    const roleDto = await this.rolesService.update(+id, updateRoleDto);
    return roleDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<RoleDto> {
    const roleDto = await this.rolesService.remove(+id);
    return roleDto;
  }

  @Patch(':id/active')
  async active(@Param('id') id: string): Promise<RoleDto> {
    const roleDto = await this.rolesService.active(+id);
    return roleDto;
  }

  @Post('permisos')
  async addPermissionsToRole(@Body() addPermissionsToRoleDto: PermissionRolesDto): Promise<RoleDto> {
    const roleDto = await this.rolesService.addPermissions(addPermissionsToRoleDto);
    return roleDto;
  }

  @Post('permisos/borrar')
  async deleteRoles(@Body() deletePermissions: PermissionRolesDto): Promise<RoleDto> {
    const roleDto = await this.rolesService.deletePermissions(deletePermissions);
    return roleDto;
  }
}
