import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

//Custom Validators
import { IsBoolean } from 'class-validator';
import { EmailNotRegistered } from '../../common/validators/email-validation';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  secondName: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsEmail()
  @EmailNotRegistered({ message: 'email already exists' })
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  @IsOptional()
  organismTypeId: number;

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

  @IsOptional()
  @IsArray()
  roleIds?: number[];
}
