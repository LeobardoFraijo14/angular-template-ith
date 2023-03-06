import { IsOptional, IsString } from "class-validator";

export class EditProfileDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    secondName: string;

    @IsString()
    @IsOptional()
    password: string;
  }
  