import { IsNotEmpty } from 'class-validator';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  route: string;

  @IsOptional()
  @IsArray()
  permissionsIds?: number[];
}
