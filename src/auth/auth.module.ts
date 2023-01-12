import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

//Services
import { AuthService } from './auth.service';

//Modules
import { UsersModule } from '../users/users.module';

//Strategies
import { JwtStrategy } from './strategies/jwt.strategy';

//Controllers
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

//Entities
import { User } from 'src/users/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule, 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {expiresIn: '60s'}
    })
  ],
  providers: [AuthService, JwtStrategy, JwtService],
  controllers: [AuthController]
})
export class AuthModule {}
