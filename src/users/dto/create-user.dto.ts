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
import { IsBoolean } from 'class-validator';

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
  suborganismId: number;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsOptional()
  @IsArray()
  roleIds?: number[];
}
