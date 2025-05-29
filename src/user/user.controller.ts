import { Controller, Post, Body, Get, Query, Inject, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RequireLogin, RequirePermission, UserInfo } from 'src/decorator/custom.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { ApiOperation, ApiTags, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUserVo } from './vo/user.vo';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @ApiOperation({ summary: '注册' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码不存在/验证码错误/注册失败',
    type: String,
  })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto);
  }

  @ApiOperation({ summary: '发送验证码' })
  @ApiQuery({ name: 'email', description: '邮箱', required: true, type: String, example: '123456@qq.com' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '验证码发送成功',
    type: String,
  })
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

  @ApiOperation({ summary: '登录' })  
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登录成功',
    type: LoginUserVo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
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

  @ApiOperation({ summary: '刷新token' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'refreshToken', description: '刷新token', required: true, type: String, example: '123456@qq.com' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新token成功',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token已过期',
    type: String,
  })
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

  @ApiOperation({ summary: '更新密码' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新密码成功',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码不存在/验证码错误/密码更新失败',
    type: String,
  })
  @Post('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.userService.updatePassword(updatePasswordDto);
  }

  @ApiOperation({ summary: '更新密码验证码' })
  @ApiQuery({ name: 'email', description: '邮箱', required: true, type: String, example: '123456@qq.com' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新密码验证码发送成功',
    type: String,
  })
  @Get('update-password/captcha')
  async updatePasswordCaptcha(@Query('email') email: string) {
    return await this.userService.updatePasswordCaptcha(email);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiBody({ type: UpdateInfoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新用户信息成功',
    type: String,
  })
  @Post('update')
  @RequireLogin()
  async updateInfo(@UserInfo('userId') userId: number, @Body() updateInfoDto: UpdateInfoDto) {
    return await this.userService.updateInfo(userId, updateInfoDto);
  }

  @ApiOperation({ summary: '更新用户信息验证码' })
  @ApiQuery({ name: 'email', description: '邮箱', required: true, type: String, example: '123456@qq.com' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新用户信息验证码发送成功',
    type: String,
  })
  @Get('update/captcha')
  async updateInfoCaptcha(@Query('email') email: string) {
    return await this.userService.updateInfoCaptcha(email);
  }

  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取用户信息成功',
    type: LoginUserVo,
  })
  @Get('info')
  @RequireLogin()
  async getUserInfo(@UserInfo('userId') userId: number) {
    return await this.userService.findUserDetailById(userId);
  }
}
