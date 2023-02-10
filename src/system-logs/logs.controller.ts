import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { LogsService } from './logs.service';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { GroupDto } from '../groups/dto/group.dto';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<GroupDto>> {
    return this.logsService.findAll(pageOptionsDto);
  }
}
