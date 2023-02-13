import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

//Services
import { UsersService } from './users.service';
import { LogsService } from '../system-logs/logs.service';

//Controller
import { UsersController } from './users.controller';

//Entities
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { RoleUser } from './entities/role-user.entity';
import { Log } from 'src/system-logs/entities/log.entity';

//Custom decorators
import { IsEmailNotRegistered } from 'src/common/validators/email-validation';
import { IsNameUnique } from '../common/validators/unique-name-validation';



@Module({
  imports: [TypeOrmModule.forFeature([User, Role, RoleUser, Log])],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, IsEmailNotRegistered, IsNameUnique, LogsService],
  exports: [UsersService]
})
export class UsersModule {}
