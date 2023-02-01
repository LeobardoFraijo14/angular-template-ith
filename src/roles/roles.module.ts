import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

//Entities
import { Role } from './entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { PermissionRole } from './entities/permission-roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, PermissionRole])],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}
