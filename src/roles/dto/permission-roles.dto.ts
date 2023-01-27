import {
    IsArray,
    IsNumber,
  } from 'class-validator';
  
  export class PermissionRolesDto {
    @IsNumber()
    roleId: number;

    @IsArray()
    permissionsIds?: number[]; 

  }
  