import { BeforeInsert, BeforeUpdate, DeleteDateColumn } from 'typeorm';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { PermissionRole } from '../../roles/entities/permission-roles.entity';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  route: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'integer', nullable: true })
  order: number;

  @Column({ name: 'created_by', type: 'integer', nullable: true })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  //Relations
  @OneToMany(
    () => PermissionRole,
    (permissionRole) => permissionRole.permission,
  )
  permissionRoles: PermissionRole[];

  @ManyToOne(() => Group, (group) => group.permissions)
  group: Group;

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
