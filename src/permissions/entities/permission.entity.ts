import { PermissionRole } from 'src/roles/entities/permission-roles.entity';
import { Role } from 'src/roles/entities/role.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  
  @Entity()
  export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    name: string;
  
    @Column({ type: 'varchar', nullable: true })
    route: string;

    @Column({ default: true})
    active: boolean;
  
    @CreateDateColumn({
      name: 'created_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: Date;

    //Relations

    // @ManyToMany(() => Role, (role) => role.permissions)
    // roles: Role[];

    @OneToMany(() => PermissionRole, permissionRole => permissionRole.permission)
    permissionRoles: PermissionRole[];
  }
  