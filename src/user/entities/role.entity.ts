import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '角色名称',
  })
  name: string;

  @Column({
    length: 255,
    comment: '角色描述',
  })
  description: string;

  @ManyToMany(() => Permission, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'role_permission',
  })
  permissions: Permission[];
}
