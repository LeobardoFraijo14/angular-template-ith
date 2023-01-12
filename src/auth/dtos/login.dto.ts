import { IsNotEmpty, IsString } from "class-validator";


export class LogInDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}