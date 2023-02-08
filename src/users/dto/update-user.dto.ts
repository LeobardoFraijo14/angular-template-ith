import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, IsEmail } from 'class-validator';
import { EmailNotRegistered } from 'src/common/validators/email-validation';

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    avatar: string;

    @IsEmail()
    @IsOptional()
    @EmailNotRegistered({ message: 'email already exists' })
    email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsNumber()
    suborganismId: number;

    @IsArray()
    @IsOptional()
    roleIds?: number[]; 
}
