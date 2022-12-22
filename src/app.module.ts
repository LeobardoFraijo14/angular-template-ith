import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'Barcel10',
      database: 'nest-template-db',
      entities: [User],
      synchronize: true
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }],
})
export class AppModule {}
