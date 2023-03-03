import {
    IsNumber,
  } from 'class-validator';
  import { IsNotEmpty } from 'class-validator';
  
  export class FindByDependencyDto {
  
    @IsNotEmpty()
    @IsNumber()
    organismId: number;
  }
  