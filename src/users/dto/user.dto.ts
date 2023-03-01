import { Exclude } from 'class-transformer';
import { RoleDto } from '../../roles/dto/role.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';

export class UserDto {
  id: number;
  name: string;
  firstName: string;
  secondName: string;
  avatar: string;
  organismId: number;
  organismTypeId: number;
  suborganismId: number;
  job: string;
  email: string;
  createdBy: number;
  isActive: boolean;
  @Exclude({ toPlainOnly: true })
  password: string;
  roles?: RoleDto[];
  permissions?: PermissionDto[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
