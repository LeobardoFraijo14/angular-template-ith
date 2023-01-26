import { RoleDto } from "src/roles/dto/role.dto";

export class UserDto {
  id: number;
  name: string;
  avatar: string;
  suborganismId: number;
  email: string;
  password: string;
  createdBy: number;
  isActive: boolean;
  roles?: RoleDto[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
