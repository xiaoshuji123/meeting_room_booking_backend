import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInfoDto {
  @ApiProperty({ description: '昵称', required: false })
  nick_name: string;

  @ApiProperty({ description: '头像', required: false })
  avatar: string;

  @ApiProperty({ description: '邮箱', required: true })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;

  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
