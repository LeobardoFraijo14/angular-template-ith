import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

//Entities
import { Permission } from 'src/permissions/entities/permission.entity';
import { DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity({ name: 'groups'})
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'integer', nullable: true })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  //Relations
  @OneToMany(() => Permission, (permission) => permission.group)
  permissions: Permission[];

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
