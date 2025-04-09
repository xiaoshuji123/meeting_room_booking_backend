import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @IsString()
  username: string;

  @IsNotEmpty({
    message: '昵称不能为空',
  })
  @IsString()
  nick_name: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码长度不能小于6位',
  })
  @IsString()
  password: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail({}, {
    message: '邮箱格式不正确',
  })
  email: string;

  
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
