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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupDto } from './dto/group.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';

//Interfaces
import { TypePermissions } from '../common/interfaces/commons.interface';

//Decorators
import { Permissions } from '../common/decorators/commons.decorator';

@Controller('grupos')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @Permissions(TypePermissions.CREATE_GROUP)
  create(@Body() createGroupDto: CreateGroupDto): Promise<GroupDto> {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @Permissions(TypePermissions.FIND_GROUPS)
  findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<GroupDto>> {
    return this.groupsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Permissions(TypePermissions.FIND_GROUPS)
  findOne(@Param('id') id: string): Promise<GroupDto> {
    return this.groupsService.findOne(+id);
  }

  @Patch(':id/editar')
  @Permissions(TypePermissions.EDIT_GROUP)
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupDto> {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Patch(':id/activar')
  // todo: ver si se agregara permiso para activar o eliminar un grupo
  active(@Param('id') id: string): Promise<GroupDto> {
    return this.groupsService.active(+id);
  }

  @Delete(':id/eliminar')
  remove(@Param('id') id: string): Promise<GroupDto> {
    return this.groupsService.remove(+id);
  }
}
