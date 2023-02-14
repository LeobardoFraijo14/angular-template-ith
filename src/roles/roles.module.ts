import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

//Entities
import { Role } from './entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { PermissionRole } from './entities/permission-roles.entity';
import { Log } from 'src/system-logs/entities/log.entity';
import { LogsService } from 'src/system-logs/logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, PermissionRole, Log])],
  controllers: [RolesController],
  providers: [RolesService, LogsService]
})
export class RolesModule {}
