import { PartialType } from '@nestjs/swagger';
import { CreateLogDto } from './create-log.dto';

export class UpdateSystemLogDto extends PartialType(CreateLogDto) {}
