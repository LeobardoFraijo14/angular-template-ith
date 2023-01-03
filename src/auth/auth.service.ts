import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtTokenService: JwtService){}

    async validateUserCredentials(username: string, password: string): Promise<any> {
        console.log('validateUserCredentials');
        const userDto = await this.usersService.findByName(username);

        if (userDto && userDto.password === password) {
            
            return userDto
        }
        return null
    }

    async loginWithCredentials(user: any) {
        const payload = { username: user.name, sub: user.id };
        console.log("loginWithCredentials");
        let access_token = await this.jwtTokenService.signAsync(payload,
            {
                secret: process.env.JWT_SECRET_KEY,
            })
        return access_token;
    }
    
}