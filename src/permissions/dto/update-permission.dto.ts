import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdatePermissionDto {

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    route: string;

    @IsOptional()
    @IsNumber()
    groupId: number;

}