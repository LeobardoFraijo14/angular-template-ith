import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from './role.entity';

//Entities

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

    @Column({ name: 'created_by', type: 'integer', nullable: true })
    createdBy: number;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: Date;
    
    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date;

    @ManyToOne(() => Role, (role) => role.permissionRoles)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @ManyToOne(() => Permission, (permission) => permission.permissionRoles)
    @JoinColumn({ name: 'permissionId' })
    permission: Permission;
}