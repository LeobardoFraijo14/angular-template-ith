import { PermissionDto } from 'src/permissions/dto/permission.dto';

export class RoleDto {
  id: number;
  name: string;
  route: string;
  isActive: boolean;
  permissions?: PermissionDto[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
