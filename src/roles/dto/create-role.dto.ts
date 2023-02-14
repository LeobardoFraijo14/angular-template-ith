import { IsNotEmpty } from 'class-validator';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  route: string;

  @IsOptional()
  @IsArray()
  permissionsIds?: number[];
}
