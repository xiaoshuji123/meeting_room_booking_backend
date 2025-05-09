import { ApiProperty } from '@nestjs/swagger';
class UserVo {
  @ApiProperty({ description: '用户ID' })
  id: number;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '昵称' })
  nick_name: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty({ description: '手机号' })
  phone: string;

  @ApiProperty({ description: '头像' })
  head_pic: string;

  @ApiProperty({ description: '是否冻结' })
  is_frozen: boolean;

  @ApiProperty({ description: '创建时间' })
  created_time: Date;

  @ApiProperty({ description: '更新时间' })
  updated_time: Date;

  @ApiProperty({ description: '是否管理员' })
  is_admin: boolean;
}

export class UserListVo {
  @ApiProperty({ type: [UserVo], description: '用户列表' })
  users: UserVo[];

  @ApiProperty({ description: '总条数' })
  total: number;
}
