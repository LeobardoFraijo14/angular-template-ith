import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//Services
import { PermissionsService } from './permissions.service';
import { LogsService } from '../system-logs/logs.service';

//Controller
import { PermissionsController } from './permissions.controller';

//Entities
import { Permission } from './entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Log } from 'src/system-logs/entities/log.entity';
import { PermissionRole } from '../roles/entities/permission-roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, Group, Log, PermissionRole])],
  controllers: [PermissionsController],
  providers: [PermissionsService, LogsService]
})
export class PermissionsModule {}
