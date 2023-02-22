import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

//Services
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

//Consts
import { ERRORS } from '../common/constants/errors.const';

//Entities
import { User } from '../users/entities/user.entity';

//Dtos
import { AuthDto } from './dtos/auth.dto';
import { PermissionDto } from '../permissions/dto/permission.dto';
import { LoginDto } from './dtos/login.dto';

//Interfaces
import { Tokens } from '../common/interfaces/jwt/Tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private _user: UsersService,
  ) {}

  async signin(authDto: AuthDto): Promise<LoginDto> {
    const user = await this.userRepository.findOne({
      where: {
        email: authDto.email,
      },
    });

    if (!user) {
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }

    const passwordMatches = await bcrypt.compare(
      authDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new HttpException(ERRORS.User_Errors.ERR003, HttpStatus.FORBIDDEN);
    }

    const tokens = await this.getToken(user.id, user.email);
    await this.updateRT(user.id, tokens.refreshToken);

    const userResponse = new LoginDto(user);
    // userResponse.roles = (await this._user.getUserRoles(user.id)).map((i) => i.id + '')
    userResponse.accessToken = tokens.accessToken
    userResponse.refreshToken = tokens.refreshToken
    userResponse.permissions = (await this._user.getUserPermission(user.id)).map((i) => i.name)

    return userResponse;
  }

  async logout(userId: number): Promise<boolean> {
    let user = await this.userRepository.findOne({
      where: {
        id: userId,
        hashedRT: Not(null),
      },
    });
    if (!user)
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    user.hashedRT = null;
    user = await this.userRepository.save(user);
    return true;
  }

  async refreshToken(userId: number, rt: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    const rMatches = await bcrypt.compare(rt, user.hashedRT);
    if (!rMatches)
      throw new HttpException(ERRORS.User_Errors.ERR004, HttpStatus.FORBIDDEN);

    const tokens = await this.getToken(user.id, user.email);
    await this.updateRT(user.id, tokens.refreshToken);
    return tokens;
  }

  async hashData(refreshToken: string) {
    const salt = 10;
    return bcrypt.hash(refreshToken, salt);
  }

  async updateRT(userId: number, refreshToken: string): Promise<void> {
    const hash = await this.hashData(refreshToken);
    let user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    user.hashedRT = hash;
    user = await this.userRepository.save(user);
  }

  async getToken(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtTokenService.signAsync(
        {
          id: userId,
          email,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.JWT_EXPIRATION,
        },
      ),
      this.jwtTokenService.signAsync(
        {
          id: userId,
          email,
        },
        {
          secret: process.env.RT_SECRET,
          expiresIn: process.env.RT_EXPIRATION,
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async getPermissions(userId: number): Promise<PermissionDto[]> {
    const permissions = await this._user.getUserPermission(userId);
    return permissions;
  }
}
