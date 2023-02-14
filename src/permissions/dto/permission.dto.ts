import { GroupDto } from '../../groups/dto/group.dto';
import { RoleDto } from '../../roles/dto/role.dto';

export class PermissionDto {
  id: number;
  name: string;
  route: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  roles?: RoleDto[];
  group?: GroupDto;
}
