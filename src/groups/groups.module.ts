import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Group])],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
