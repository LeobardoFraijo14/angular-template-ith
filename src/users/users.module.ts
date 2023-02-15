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
import { RoleUser } from './entities/role-user.entity';
import { Log } from '../system-logs/entities/log.entity';

//Custom decorators
import { IsNameUnique } from '../common/validators/unique-name-validation';
import { IsEmailNotRegistered } from '../common/validators/email-validation';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, RoleUser, Log])],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, IsEmailNotRegistered, IsNameUnique, LogsService],
  exports: [UsersService]
})
export class UsersModule {}
