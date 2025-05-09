import { ApiProperty } from "@nestjs/swagger";

class UserInfo {
  @ApiProperty({ description: '用户ID' })
  id: number;
  @ApiProperty({ description: '用户名' })
  username: string;
  @ApiProperty({ description: '昵称' })
  nickName: string;
  @ApiProperty({ description: '邮箱' })
  email: string;
  @ApiProperty({ description: '头像' })
  headPic: string;
  @ApiProperty({ description: '手机号' })
  phone: string;
  @ApiProperty({ description: '是否冻结' })
  isFrozen: boolean;
  @ApiProperty({ description: '是否管理员' })
  isAdmin: boolean;
  @ApiProperty({ description: '创建时间' })
  createdTime: Date;
  @ApiProperty({ description: '角色' })
  roles: string[];
  @ApiProperty({ description: '权限' })
  permissions: string[];
}

export class LoginUserVo {
  @ApiProperty({ description: '用户信息' })
  userInfo: UserInfo;
  @ApiProperty({ description: '访问令牌' })
  accessToken: string;
  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string;
}
