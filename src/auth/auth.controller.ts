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
// import { JwtAuthGuard } from './jwt-auth.guard';

//Decorators
import { LoginDto } from './dtos/login.dto';
import { Public } from '../common/decorators/commons.decorator';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

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

  @Get('verificarToken')
  verifyToken() {
    return true;
  }

  @Public()
  @Post('login')
  login(@Body() authDto: AuthDto): Promise<LoginDto> {
    return this.authService.signin(authDto);
  }

  @Public()
  @Post('logout')
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Public() // uso este decorador para que no entre al guard que valida el token en el header y solo que valider con el RefreshTokenGuard
  @Post('refresh')
  refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
