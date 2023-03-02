import { Controller, Post, Body, Query, Get } from '@nestjs/common';

//Services
import { LogsService } from './logs.service';

//Dtos
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { GroupDto } from '../groups/dto/group.dto';
import { CreateLogDto } from './dto/create-log.dto';

//Decorators
import { Permissions } from '../common/decorators/commons.decorator';

//Interfaces
import { TypePermissions } from '../common/interfaces/commons.interface';
import { create } from 'domain';
import { LogDto } from './dto/logs.dto';


@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @Permissions(TypePermissions.CREATE_USER)
  findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<GroupDto>> {
    return this.logsService.findAll(pageOptionsDto);
  }

  @Post()
  @Permissions(TypePermissions.CREATE_USER)
  async createLog(@Body() createLogDto: CreateLogDto): Promise<LogDto>{
    const logDto = await this.logsService.create(createLogDto);
    return logDto;
  }
}
