import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express"
 
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
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
        // todo: validar el usuario en la BD y mandarlo en la request
        return {
            ok: true
        }
    }
}