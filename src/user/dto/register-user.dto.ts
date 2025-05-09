import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @IsString()
  username: string;

  @ApiProperty({ description: '昵称' })
  @IsNotEmpty({
    message: '昵称不能为空',
  })
  @IsString()
  nick_name: string;

  @ApiProperty({ description: '密码', minLength: 6 })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码长度不能小于6位',
  })
  @IsString()
  password: string;

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail({}, {
    message: '邮箱格式不正确',
  })
  email: string;

  @ApiProperty({ description: '验证码' })
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
