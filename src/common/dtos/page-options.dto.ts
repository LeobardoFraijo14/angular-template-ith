import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, Max, Min, IsString } from 'class-validator';
import { Order } from "../enums/pagination-order.enum";
import { TakeAll } from '../enums/take-all.enum';

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @IsEnum(TakeAll)
  @IsOptional()
  readonly all?: TakeAll = TakeAll.FALSE;

  @IsEnum(TakeAll)
  @IsOptional()
  readonly withDeleted?: TakeAll = TakeAll.TRUE;
}