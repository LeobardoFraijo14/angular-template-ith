import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

//Custom Validators
import { EmailNotRegistered } from 'src/common/validators/email-validation';
import { UniqueName } from 'src/common/validators/unique-name-validation';

export class CreateUserDto {
  
  @IsString()
  @UniqueName()
  name: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsEmail()
  @EmailNotRegistered()
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
