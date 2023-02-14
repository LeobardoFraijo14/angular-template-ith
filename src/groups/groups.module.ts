import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//Services
import { GroupsService } from './groups.service';
import { LogsService } from '../system-logs/logs.service';

//Controllers
import { GroupsController } from './groups.controller';

//Entities
import { Permission } from 'src/permissions/entities/permission.entity';
import { Group } from './entities/group.entity';
import { Log } from 'src/system-logs/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Group, Log])],
  controllers: [GroupsController],
  providers: [GroupsService, LogsService]
})
export class GroupsModule {}
