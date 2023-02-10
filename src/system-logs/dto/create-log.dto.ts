import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { SYSTEM_CATALOGUES } from '../../common/enums/system-catalogues.enum';
import { LOG_MOVEMENTS } from '../../common/enums/log-movements.enum';
export class CreateLogDto {
  // @IsNumber()
  // @IsNotEmpty()
  // userId: number;
  //

  @IsEnum(SYSTEM_CATALOGUES)
  @IsNotEmpty()
  catalogue: SYSTEM_CATALOGUES;

  @IsEnum(LOG_MOVEMENTS)
  @IsNotEmpty()
  movement: LOG_MOVEMENTS;

  @IsString()
  @IsOptional()
  oldInfo?: string;

  @IsString()
  @IsNotEmpty()
  newInfo: string;
}
