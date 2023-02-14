import { PermissionDto } from '../../permissions/dto/permission.dto';

export class GroupDto {
  id: number;
  name: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  permissions?: PermissionDto[];
}
