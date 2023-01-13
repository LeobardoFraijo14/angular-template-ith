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
  
  @Column({ type: 'varchar', length: 191, unique: true })
  curp: string;

  @Column({ type: 'varchar', length: 191 })
  name: string;

  @Column({ type: 'varchar', length: 191 })
  first_name: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: UserGender })
  gender: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  acronym: string;

  @Column()
  birthday: Date;

  @Column({ type: 'varchar', length: 191 })
  zip_code: string;

  @Column({ type: 'integer' })
  country_id: number;

  @Column({ type: 'integer' })
  state_id: number;

  @Column({ type: 'integer' })
  city_id: number;

  @Column({ type: 'varchar', length: 191 })
  neighborhood: string;

  @Column({ type: 'varchar', length: 255 })
  street: string;

  @Column({ type: 'varchar', length: 191 })
  house_number: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  suit_number: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 191 })
  phone_numer: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'integer', nullable: true })
  order: number;

  @Column()
  active: boolean;

  @Column()
  hashedRT: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
