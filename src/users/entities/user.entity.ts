import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserGender } from '../enums/user-gender.enum';

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
}
