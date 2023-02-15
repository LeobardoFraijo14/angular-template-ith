import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

//Entities
import { Role } from './entities/role.entity';
import { PermissionRole } from './entities/permission-roles.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Log } from '../system-logs/entities/log.entity';
import { RoleUser } from '../users/entities/role-user.entity';

//Services
import { LogsService } from '../system-logs/logs.service';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, PermissionRole, Log, RoleUser])],
  controllers: [RolesController],
  providers: [RolesService, LogsService]
})
export class RolesModule {}
