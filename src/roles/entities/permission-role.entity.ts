import { Permission } from "src/permissions/entities/permission.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

//Entities
import { Role } from "./role.entity";

@Entity('permission_roles')
export class PermissionRole {
    @PrimaryColumn({ name: 'role_id' })
    roleId: number;

    @PrimaryColumn({ name: 'permission_id' })
    permissionId: number;

    //Bidirectional relation
    @ManyToOne(
        () => Role,
        role => role.permissions,
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
    )
    @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
    roles: Role[];

    @ManyToOne(
        () => Permission,
        permission => permission.roles,
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
    )
    @JoinColumn([{ name: 'permission_id', referencedColumnName: 'id' }])
    permissions: Permission[];
    }