import { IsNumber, IsArray } from 'class-validator';

export class RoleUserDto {
  @IsNumber()
  userId: number;

  @IsArray()
  roleIds?: number[];
}
