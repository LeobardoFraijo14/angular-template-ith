import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  route: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  groupId: number;
}
