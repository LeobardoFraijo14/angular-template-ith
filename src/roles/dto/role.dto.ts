import { PermissionDto } from "src/permissions/dto/permission.dto";

export class RoleDto {
    id: number;
    name: string;
    route: string;
    active: boolean;
    permissions?: PermissionDto[]; 
    createdAt: Date;
    updatedAt: Date;
  }
  