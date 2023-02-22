import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { RoleUser } from './role-user.entity';
import { UpdateDateColumn } from 'typeorm';
import { Log } from '../../system-logs/entities/log.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191 })
  name: string;

  @Column({ type: 'varchar', length: 191 })
  firstName: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  secondName: string;

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

  @Column({ type: 'integer', nullable: true })
  organismId: number;

  @Column({ type: 'varchar' })
  job: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  //Relations
  @OneToMany(() => RoleUser, (roleUsers) => roleUsers.user)
  public roleUsers: RoleUser[];

  @OneToMany(() => Log, (log) => log.user)
  logs: Log[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.job = this.job.toUpperCase().trim();
    this.email = this.email.toLowerCase().trim();
    this.name = this.name.toUpperCase().trim();
    this.firstName = this.firstName.toUpperCase().trim();
    this.secondName =
      typeof this.secondName === 'string' && this.secondName.trim()
        ? this.secondName.toUpperCase().trim()
        : null;
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
