import { Controller, Post, Body, Get, Inject, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';
import { RequireLogin, UserInfo } from 'src/decorator/custom.decorator';
import { UserService } from 'src/user/user.service';
import { UpdateInfoDto } from 'src/user/dto/update-info.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Inject(UserService)
  private userService: UserService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
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

  @Get('update-password/captcha')
  async updatePasswordCaptcha(@Query('email') email: string) {
    return await this.userService.updatePasswordCaptcha(email);
  }

  @Post('update')
  @RequireLogin()
  async updateInfo(@UserInfo('userId') userId: number, @Body() updateInfoDto: UpdateInfoDto) {
    return await this.userService.updateInfo(userId, updateInfoDto);
  }

  @Get('info')
  @RequireLogin()
  async getUserInfo(@UserInfo('userId') userId: number) {
    return await this.userService.findUserDetailById(userId);
  }
}
