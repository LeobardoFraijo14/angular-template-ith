import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

//Services
import { GroupsService } from './groups.service';

//Dtos
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { GroupDto } from './dto/group.dto';
import { PageDto } from 'src/common/dtos/page.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    const groupDto = await this.groupsService.create(createGroupDto);
    return groupDto;
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<GroupDto>> {
    const groupsDto = await this.groupsService.findAll(pageOptionsDto);
    return groupsDto;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GroupDto> {
    const groupDto = await this.groupsService.findOne(+id);
    return groupDto;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto): Promise<GroupDto> {
    const groupDto = await this.groupsService.update(+id, updateGroupDto);
    return groupDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<GroupDto> {
    const groupDto = await this.groupsService.remove(+id);
    return groupDto;
  }

  @Patch(':id/active')
  async active(@Param('id') id: string): Promise<GroupDto>{
    const groupDto = await this.groupsService.active(+id);
    return groupDto;
  }
}
