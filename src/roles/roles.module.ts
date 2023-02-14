import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

//Entities
import { Role } from './entities/role.entity';
import { PermissionRole } from './entities/permission-roles.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, PermissionRole])],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}
