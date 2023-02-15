import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { Group } from '../groups/entities/group.entity';

//Services
import { PermissionsService } from './permissions.service';
import { LogsService } from '../system-logs/logs.service';

//Controller
import { PermissionsController } from './permissions.controller';

//Entities
import { Permission } from './entities/permission.entity';
import { PermissionRole } from '../roles/entities/permission-roles.entity';
import { Log } from '../system-logs/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, Group, Log, PermissionRole])],
  controllers: [PermissionsController],
  providers: [PermissionsService, LogsService]
})
export class PermissionsModule { }
