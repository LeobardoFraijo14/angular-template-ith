import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Log } from 'src/system-logs/entities/log.entity';
import { LogsService } from '../system-logs/logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, Group, Log])],
  controllers: [PermissionsController],
  providers: [PermissionsService, LogsService]
})
export class PermissionsModule {}
