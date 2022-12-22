import { IsString, IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    avatar: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsBoolean()
    isSigner: boolean;

    @IsString()
    acronym: string;

    @IsBoolean()
    active: boolean;
}