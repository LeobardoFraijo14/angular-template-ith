import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

//Services
import { AuthService } from './auth.service';

//Modules
import { UsersModule } from '../users/users.module';

//Strategies
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

//Controllers
import { AuthController } from './auth.controller';


@Module({
  imports: [
    UsersModule, 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {expiresIn: '60s'}
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
