import { Controller, Post, Body, Get, Inject, Query, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';
import { RequireLogin, UserInfo } from 'src/decorator/custom.decorator';
import { UserService } from 'src/user/user.service';
import { UpdateInfoDto } from 'src/user/dto/update-info.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { UserListDto } from './dto/user-list.dto';
import { ApiOperation, ApiTags, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LoginUserVo } from 'src/user/vo/user.vo';
import { FreezeDto } from './dto/freeze.dto';
import { UserListVo } from './vo/user.vo';
@ApiTags('管理员模块')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Inject(UserService)
  private userService: UserService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登录成功',
    type: LoginUserVo,
  })
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

  @ApiOperation({ summary: '冻结用户' })
  @ApiBody({ type: FreezeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '冻结用户成功',
    type: String,
  })
  @Post('freeze')
  @RequireLogin()
  async freeze(@Body() freezeDto: FreezeDto) {
    return await this.adminService.freezeUserById(freezeDto.id);
  }

  @ApiOperation({ summary: '用户列表' })
  @ApiBody({ type: UserListDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户列表成功',
    type: UserListVo,
  })
  @Post('user-list')
  async userList(@Body() userListDto: UserListDto) {
    return await this.adminService.userList(userListDto);
  }
}
