import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { LogDto } from './dto/logs.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { GroupDto } from '../groups/dto/group.dto';
import { PageQueryOptions } from '../common/dtos/page-query-options.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async create(createLogDto: CreateLogDto): Promise<LogDto> {
    const logData = { ...createLogDto, registerId: uuid() };

    const log = this.logRepository.create(logData);

    await this.logRepository.save(log);

    const logDto = plainToInstance(LogDto, log);

    return logDto;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<GroupDto>> {
    const whereCluase =
      pageOptionsDto.withDeleted === 'true' ? {} : { isActive: true };

    const itemCount = (
      await this.logRepository.find({
        where: whereCluase,
      })
    ).length;

    if (pageOptionsDto.all === 'true') {
      pageOptionsDto.take = itemCount;
      pageOptionsDto.page = 1;
    }

    const dbQuery: PageQueryOptions = {
      where: whereCluase,
      order: { createdAt: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    };

    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
    const groups = await this.logRepository.find(dbQuery);

    const groupsDto = plainToInstance(GroupDto, groups);

    return new PageDto(groupsDto, pageMeta);
  }
}
