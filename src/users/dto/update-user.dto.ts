import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsEmail,
} from 'class-validator';
import { IsBoolean } from 'class-validator';
import { EmailNotRegistered } from '../../common/validators/email-validation';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  secondName: string;

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

  @IsNumber()
  @IsOptional()
  organismId: number;

  @IsNumber()
  @IsOptional()
  suborganismId: number;

  @IsString()
  @IsOptional()
  job: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsArray()
  @IsOptional()
  roleIds?: number[];
}
