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
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';

@Controller('permisos')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDto> {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PermissionDto>> {
    return this.permissionsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PermissionDto> {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id/editar')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionDto> {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id/eliminar')
  remove(@Param('id') id: string): Promise<PermissionDto> {
    return this.permissionsService.remove(+id);
  }

  @Patch(':id/activar')
  active(@Param('id') id: string): Promise<PermissionDto> {
    return this.permissionsService.active(+id);
  }
}
