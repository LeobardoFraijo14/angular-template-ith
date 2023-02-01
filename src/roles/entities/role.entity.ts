import { Permission } from 'src/permissions/entities/permission.entity';
import { RoleUser } from 'src/users/entities/role-user.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
  } from 'typeorm';
import { PermissionRole } from './permission-roles.entity';
  
  @Entity()
  export class Role {
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

    // @ManyToMany(() => Permission)
    // @JoinTable({name: "permission_roles"})
    // permissions: Permission[];

    // @ManyToMany(() => User, (user) => user.roles)
    // users: User[];

    @OneToMany(() => RoleUser, roleUser => roleUser.role)
    public roleUsers: RoleUser[];

    @OneToMany(() => PermissionRole, permissionRole => permissionRole.role)
    public permissionRoles: RoleUser[];
  }
  