import { RoleDto } from 'src/roles/dto/role.dto';
import { Exclude } from 'class-transformer';

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
