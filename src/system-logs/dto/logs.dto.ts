import { LOG_MOVEMENTS } from '../../common/enums/log-movements.enum';
import { SYSTEM_CATALOGUES } from '../../common/enums/system-catalogues.enum';

export class LogDto {
  id: number;
  userId: number;
  registerId: string;
  catalogue: SYSTEM_CATALOGUES;
  isActive: boolean;
  movement: LOG_MOVEMENTS;
  oldInfo: string;
  newInfo: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
