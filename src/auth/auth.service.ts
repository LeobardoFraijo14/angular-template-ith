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

//Consts
import { ERRORS } from 'src/common/constants/errors.const';

//Entities
import { User } from 'src/users/entities/user.entity';

//Dtos
import { AuthDto } from './dtos/auth.dto';

//Interfaces
import { Tokens } from 'src/common/interfaces/jwt/Tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signInLocal(authDto: AuthDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: authDto.email,
        },
      });
      console.log({ user });
      if (!user)
        throw new HttpException(
          ERRORS.User_Errors.ERR002,
          HttpStatus.NOT_FOUND,
        );
      const passwordMatches = await bcrypt.compare(
        authDto.password,
        user.password,
      );
      if (!passwordMatches)
        throw new HttpException(
          ERRORS.User_Errors.ERR003,
          HttpStatus.FORBIDDEN,
        );

      const tokens = this.getToken(user.id, user.email);
      await this.updateRT(user.id, (await tokens).refresh_token);
      return tokens;
    } catch (error) {
      console.log(error);
    }
  }

  async authVerification(authDto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: authDto.email,
      },
    });

    if (!user) {
      // TODO: mejorar mensajes de error
      // throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
      throw new UnauthorizedException('Credenciales no válidas');
    }

    const passwordMatches = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!passwordMatches) {
      // TODO: mejorar mensajes de error
      // throw new HttpException(ERRORS.User_Errors.ERR003, HttpStatus.FORBIDDEN);
      throw new UnauthorizedException('Credenciales no válidas');
    }
    const tokens = this.getToken(user.id, user.email);
    await this.updateRT(user.id, (await tokens).refresh_token);

    const response = {
      id: user.id,
      roles: [],
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: (await tokens).access_token,
    };

    return response;
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
    await this.updateRT(user.id, tokens.refresh_token);
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
          sub: userId,
          id: userId,
          email,
          roles: [],
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: 60 * 10,
        },
      ),
      this.jwtTokenService.signAsync(
        {
          sub: userId,
          id: userId,
          email,
          roles: [],
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: 60 * 10 * 24,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
