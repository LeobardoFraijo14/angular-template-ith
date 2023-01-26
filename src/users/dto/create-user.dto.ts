import {
  IsString,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  @IsOptional()
  suborganismId: number;

  @IsOptional()
  @IsArray()
  roleIds?: number[]; 
}
