import {
    IsNumber,
    IsArray,
  } from 'class-validator';
  
  export class UserRolesDto {
    @IsNumber()
    userId: number;
  
    @IsArray()
    roleIds?: number[]; 
  }
  