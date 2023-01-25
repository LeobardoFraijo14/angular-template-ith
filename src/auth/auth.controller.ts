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
  async signInLocal(@Body() authDto: AuthDto) {
    const tokens = await this.authService.signInLocal(authDto);
    return tokens;
  }

  @Post()
  async authVerification(@Body() authDto: AuthDto) {
    const tokens = await this.authService.authVerification(authDto);
    return tokens;
  }

  @Post('logout')
  async logout(@GetCurrentUser() userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return await this.authService.refreshToken(userId, refreshToken);
  }
}
