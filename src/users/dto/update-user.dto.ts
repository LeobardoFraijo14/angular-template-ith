import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    avatar: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsBoolean()
    @IsOptional()
    isSigner: boolean;

    @IsString()
    @IsOptional()
    acronym: string;

    @IsBoolean()
    active: boolean;
}
