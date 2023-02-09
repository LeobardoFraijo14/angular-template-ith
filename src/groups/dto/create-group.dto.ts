import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  order: number;

  @IsArray()
  @IsOptional()
  @IsNumber()
  permissionIds?: number[];
}
