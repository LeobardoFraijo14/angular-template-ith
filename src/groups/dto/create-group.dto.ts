import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateGroupDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsNumber()
    order: number;

    @IsArray()
    @IsOptional()
    @IsNumber()
    permissionIds?: number[];

}
