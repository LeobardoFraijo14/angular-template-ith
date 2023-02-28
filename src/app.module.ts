import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

//Controllers
import { AppController } from './app.controller';

//Services
import { AppService } from './app.service';

//Modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { GroupsModule } from './groups/groups.module';

//Db configuration
import { dataSourceOption } from '../db/data-source';

//Filters
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

//Entities
import { User } from './users/entities/user.entity';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { AccessTokenGuard } from './common/guards/access-token.guard';
import { SystemLogsModule } from './system-logs/system-logs.module';
import { LogsService } from './system-logs/logs.service';
import { Log } from './system-logs/entities/log.entity';
import { Role } from './roles/entities/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOption()),
    TypeOrmModule.forFeature([User, Log, Role]),
    UsersModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    GroupsModule,
    SystemLogsModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    LogsService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
