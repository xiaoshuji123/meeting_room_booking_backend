import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdatePasswordDto {
  @ApiProperty({ description: '邮箱', required: true })
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '邮箱格式不正确',
    },
  )
  email: string;

  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;

  @ApiProperty({ description: '新密码', required: true, example: '123456', minLength: 6 })
  @IsNotEmpty({
    message: '新密码不能为空',
  })
  @MinLength(6, {
    message: '密码长度不能小于6位',
  })
  new_password: string;
}
