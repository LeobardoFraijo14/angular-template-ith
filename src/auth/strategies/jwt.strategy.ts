import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY
        })
    }
    async validate(payload: any) {
        // const refreshToken = req.get('authorization').replace('bearer', '').trim();
        // return {
        //     ...payload,
        //     refreshToken,
        // };}
        // TODO: validar el usuario en la BD y mandarlo en la request
        const user = await this.userRepository.findOne({
            where: {
                id: payload.id,
            },
        });
        return {
            ok: true
        }
    }
}