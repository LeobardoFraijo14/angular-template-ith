import { Type } from "class-transformer";
import { IsArray, IsOptional } from "class-validator";

export class RelationsOptionsDto{

    @Type(() => String)
    @IsArray()
    @IsOptional()
    readonly relations?: string[];
}