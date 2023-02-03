import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    route: string;

    @IsNumber()
    groupId: number;

}