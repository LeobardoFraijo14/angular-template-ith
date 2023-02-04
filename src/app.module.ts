import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOption()),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    GroupsModule    
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessTokenGuard,
    // }
  ],
})
export class AppModule {}
