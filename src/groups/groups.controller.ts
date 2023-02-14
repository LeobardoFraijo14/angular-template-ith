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
import { GroupsService } from './groups.service';

//Dtos
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupDto } from './dto/group.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';

@Controller('grupos')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto): Promise<GroupDto> {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<GroupDto>> {
    return this.groupsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GroupDto> {
    return this.groupsService.findOne(+id);
  }

  @Patch(':id/editar')
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupDto> {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Delete(':id/activar')
  remove(@Param('id') id: string): Promise<GroupDto> {
    return this.groupsService.remove(+id);
  }

  @Patch(':id/active')
  async active(@Param('id') id: string): Promise<GroupDto> {
    const groupDto = await this.groupsService.active(+id);
    return groupDto;
  }
}
