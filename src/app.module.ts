import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { dataSourceOptions } from 'db/data-source';
import { AccessTokenGuard } from './common/guards/access-token.guard';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule
  ],
  
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    }],
})
export class AppModule {}
