import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

//Services
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

//Dtos
import { AuthDto } from './dtos/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

//Guards
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

//Decorators
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('user-info')
  getUserInfo(@Request() req) {
    return req.user;
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const tokens = await this.authService.getToken(user.id, user.email);
    return tokens;
  }

  @Post('login')
  login(@Body() authDto: AuthDto): Promise<LoginDto> {
    return this.authService.signin(authDto);
  }

  @Get('verificarToken')
  // @UseGuards(AuthGuard())
  verifyToken() {
    return true;
  }

  @Post('logout')
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
