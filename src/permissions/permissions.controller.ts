import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

//Services
import { PermissionsService } from './permissions.service';

//Dtos
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionDto } from './dto/permission.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<PermissionDto> {
    const permissionDto = await this.permissionsService.create(createPermissionDto);
    return permissionDto;
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<PermissionDto>> {
    const permissionsDto = await this.permissionsService.findAll(pageOptionsDto);
    return permissionsDto;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PermissionDto> {
    const permissionDto = await this.permissionsService.findOne(+id);
    return permissionDto;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto): Promise<PermissionDto> {
    const permissionDto = await this.permissionsService.update(+id, updatePermissionDto);
    return permissionDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PermissionDto> {
    const permissionDto = await this.permissionsService.remove(+id);
    return permissionDto;
  }

  @Patch(':id/active')
  async active(@Param('id') id: string): Promise<PermissionDto> {
    const permissionDto = await this.permissionsService.active(+id);
    return permissionDto;
  }
}
