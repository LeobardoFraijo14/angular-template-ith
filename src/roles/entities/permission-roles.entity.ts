import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

//Entities
import { Role } from "src/roles/entities/role.entity"
import { Permission } from "src/permissions/entities/permission.entity";

@Entity({ name: 'permission_roles'})
export class PermissionRole {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    isActive: boolean;

    @Column()
    roleId: number;

    @Column()
    permissionId: number;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: Date;

    @ManyToOne(() => Role, (role) => role.permissionRoles)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @ManyToOne(() => Permission, (permission) => permission.permissionRoles)
    @JoinColumn({ name: 'permissionId' })
    permission: Permission;
}