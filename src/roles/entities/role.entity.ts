import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  DeleteDateColumn,
} from 'typeorm';
import { RoleUser } from '../../users/entities/role-user.entity';
import { PermissionRole } from './permission-roles.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  route: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'created_by', type: 'integer', nullable: true })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  //Relations
  @OneToMany(() => RoleUser, (roleUser) => roleUser.role)
  public roleUsers: RoleUser[];

  @OneToMany(() => PermissionRole, (permissionRole) => permissionRole.role)
  public permissionRoles: PermissionRole[];

  // Functions
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.name = this.name.toUpperCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
