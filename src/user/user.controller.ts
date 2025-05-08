import { Controller, Post, Body, Get, Query, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RequireLogin, RequirePermission, UserInfo } from 'src/decorator/custom.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto);
  }

  @Get('register/captcha')
  async captcha(@Query('email') email: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${email}`, code, 60 * 5);
    await this.emailService.sendEmail(email, '注册验证码', `你的注册验证码是 ${code}`);
    return {
      code: 200,
      message: '验证码发送成功',
    };
  }

  @Post('init-data')
  async initData() {
    await this.userService.initData();
    return '初始化数据成功';
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    const user = await this.userService.login(loginDto);
    const { accessToken, refreshToken } = await this.userService.generateToken({
      id: user.userInfo.id,
      username: user.userInfo.username,
      roles: user.userInfo.roles,
      permissions: user.userInfo.permissions,
    });
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    return {
      code: 200,
      message: '登录成功',
      data: user,
    };
  }

  @Get('refresh-token')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    const { accessToken, refreshToken: newRefreshToken } = await this.userService.refreshToken(refreshToken);
    return {
      code: 200,
      message: '刷新token成功',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  @Get('test2')
  @RequireLogin()
  @RequirePermission('admin')
  async test2(@UserInfo() user: any, @UserInfo('username') username: string) {
    console.log('user', user);
    console.log('username', username);
    return 'test2';
  }

  @Post('update-password')
  @RequireLogin()
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.userService.updatePassword(updatePasswordDto);
  }

  @Get('update-password/captcha')
  async updatePasswordCaptcha(@Query('email') email: string) {
    return await this.userService.updatePasswordCaptcha(email);
  }

  @Post('update')
  @RequireLogin()
  async updateInfo(@UserInfo('userId') userId: number, @Body() updateInfoDto: UpdateInfoDto) {
    return await this.userService.updateInfo(userId, updateInfoDto);
  }

  @Get('update/captcha')
  async updateInfoCaptcha(@Query('email') email: string) {
    return await this.userService.updateInfoCaptcha(email);
  }

  @Get('info')
  @RequireLogin()
  async getUserInfo(@UserInfo('userId') userId: number) {
    return await this.userService.findUserDetailById(userId);
  }
}
