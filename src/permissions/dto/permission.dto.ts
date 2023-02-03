
import { GroupDto } from "src/groups/dto/group.dto";
import { RoleDto } from "src/roles/dto/role.dto";

export class PermissionDto{
    id: number;
    name: string;
    route: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    roles?: RoleDto[];
    group?: GroupDto;
}