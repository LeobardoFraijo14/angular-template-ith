import { User } from '../../users/entities/user.entity';
import { SYSTEM_CATALOGUES } from '../../common/enums/system-catalogues.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LOG_MOVEMENTS } from '../../common/enums/log-movements.enum';

@Entity({ name: 'logs' })
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'varchar' })
  registerId: number;

  @Column({ type: 'enum', enum: SYSTEM_CATALOGUES })
  catalogue: SYSTEM_CATALOGUES;

  @Column({ type: 'enum', enum: LOG_MOVEMENTS })
  movement: LOG_MOVEMENTS;

  @Column({ type: 'varchar', nullable: true })
  oldInfo: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  newInfo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.logs)
  user: User;
}
