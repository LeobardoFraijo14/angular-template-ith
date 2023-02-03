import { PermissionDto } from "src/permissions/dto/permission.dto";

export class GroupDto {
    id: number;
    name: string;
    active: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    permissions?: PermissionDto[];
}