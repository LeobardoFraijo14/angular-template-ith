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

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, ConfigService],
  exports: [UsersService]
})
export class UsersModule {}
