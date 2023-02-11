import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interfaces/jwt/JwtPayload.interface';
import { JwtPayloadWithRT } from 'src/common/interfaces/jwt/JwtPayloadWithRT.interface';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  // validate(req: Request, payload: JwtPayload): JwtPayloadWithRT {
  //   const refreshToken = req
  //     ?.get('authorization')
  //     ?.replace('Bearer', '')
  //     .trim();

  //   if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

  //   return {
  //     ...payload,
  //     refreshToken,
  //   };
  // }
}