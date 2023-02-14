import { Exclude } from 'class-transformer';
import { RoleDto } from '../../roles/dto/role.dto';

export class UserDto {
  id: number;
  name: string;
  firstName: string;
  secondName: string;
  avatar: string;
  suborganismId: number;
  email: string;
  createdBy: number;
  isActive: boolean;
  @Exclude({ toPlainOnly: true })
  password: string;
  roles?: RoleDto[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
