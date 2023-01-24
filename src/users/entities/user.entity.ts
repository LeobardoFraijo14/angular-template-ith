import { Role } from 'src/roles/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 191 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'integer', nullable: true })
  suborganismId: number;

  @Column({ type: 'integer', nullable: true })
  createdBy: number;

  @Column({ type: 'varchar', nullable: true })
  hashedRT: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'updatedAt', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt: Date;

  //Relations
  @ManyToMany(
    () => Role, 
    role => role.users, //optional
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
    @JoinTable({
      name: 'role_users',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      inverseJoinColumn: {
        name: 'role_id',
        referencedColumnName: 'id',
      },
    })
    roles?: Role[];
}
