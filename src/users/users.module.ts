import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

//Services
import { UsersService } from './users.service';

//Controller
import { UsersController } from './users.controller';

//Entities
import { User } from './entities/user.entity';
import { RoleUser } from './entities/role-users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RoleUser])],
  controllers: [UsersController],
  providers: [UsersService, ConfigService],
  exports: [UsersService]
})
export class UsersModule {}
