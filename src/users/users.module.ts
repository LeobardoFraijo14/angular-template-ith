import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

//Services
import { UsersService } from './users.service';

//Controller
import { UsersController } from './users.controller';

//Entities
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { RoleUser } from './entities/role-user.entity';

//Custom decorators
import { IsEmailNotRegistered } from 'src/common/validators/email-validation';
import { IsNameUnique } from '../common/validators/unique-name-validation';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, RoleUser])],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, IsEmailNotRegistered, IsNameUnique],
  exports: [UsersService]
})
export class UsersModule {}
