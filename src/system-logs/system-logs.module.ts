import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Log } from './entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Log])],
  controllers: [LogsController],
  providers: [LogsService],
})
export class SystemLogsModule {}
