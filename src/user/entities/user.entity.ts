import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    length: 50,
    comment: '昵称',
  })
  nick_name: string;

  @Column({
    length: 50,
    comment: '邮箱',
  })
  email: string;

  @Column({
    length: 255,
    comment: '头像',
    nullable: true,
  })
  head_pic: string;

  @Column({
    length: 11,
    comment: '手机号',
    nullable: true,
  })
  phone: string;

  @Column({
    default: false,
    comment: '是否冻结',
  })
  is_frozen: boolean;

  @Column({
    default: false,
    comment: '是否管理员',
  })
  is_admin: boolean;

  @CreateDateColumn({
    comment: '创建时间',
  })
  created_time: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updated_time: Date;

  @ManyToMany(() => Role, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'user_role',
  })
  roles: Role[];
}
