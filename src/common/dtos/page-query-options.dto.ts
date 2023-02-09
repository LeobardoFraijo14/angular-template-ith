import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class PageQueryOptions {
  @IsObject()
  @IsOptional()
  where?: object;

  @IsObject()
  @IsOptional()
  relations?: object;

  @IsObject()
  @IsOptional()
  order?: object;

  @IsNumber()
  @IsOptional()
  take?: number;

  @IsNumber()
  @IsOptional()
  skip?: number;
}
