import {
    IsArray,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateRoleDto {
    @IsString()
    name: string;
  
    @IsString()
    route: string;

    @IsOptional()
    @IsArray()
    permissionsIds?: number[]; 

  }
  