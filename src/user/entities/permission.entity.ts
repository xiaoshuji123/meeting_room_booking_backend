import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '权限编码',
  })
  code: string;

  @Column({
    length: 255,
    comment: '权限描述',
  })
  description: string;
}
