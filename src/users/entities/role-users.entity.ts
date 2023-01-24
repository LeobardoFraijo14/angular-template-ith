import { Role } from 'src/roles/entities/role.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('role_users')
export class RoleUser {
  
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'role_id' })
  roleId: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ManyToOne(
    () => User,
    user => user.roles,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: User[];

  @ManyToOne(
    () => Role,
    role => role.users,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  roles: Role[];

}
