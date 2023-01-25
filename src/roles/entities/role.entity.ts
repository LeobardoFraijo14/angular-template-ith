import { Permission } from 'src/permissions/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  
  @Entity()
  export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    name: string;
  
    @Column({ type: 'varchar', nullable: true })
    route: string;

    @Column({ default: true})
    active: boolean;
  
    @CreateDateColumn({
      name: 'created_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: Date;

    //Relations
    @ManyToMany(
      () => User,
      user => user.roles,
      {onDelete: 'NO ACTION', onUpdate: 'NO ACTION',},
    )
    users?: User[];

    @ManyToMany(
      () => Permission, 
      permission => permission.roles, //optional
      {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
      @JoinTable({
        name: 'permission_roles',
        joinColumn: {
          name: 'role_id',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'permission_id',
          referencedColumnName: 'id',
        },
      })
      permissions?: Permission[];
  }
  