import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

//Entities
import { User } from './user.entity';

@Entity({ name: 'role_users' })
export class RoleUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: number;

  @Column()
  userId: number;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Role, (role) => role.roleUsers)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => User, (user) => user.roleUsers)
  @JoinColumn({ name: 'userId' })
  user: User;
}
