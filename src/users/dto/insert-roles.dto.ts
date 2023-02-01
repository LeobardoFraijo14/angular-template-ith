import { PermissionDto } from "src/permissions/dto/permission.dto";
import { Role } from "src/roles/entities/role.entity";

export class InsertRolesDto {

    name: string;
    route: string;
    active: boolean;
    rolesIds: number[];
    userId: number;

  }
  