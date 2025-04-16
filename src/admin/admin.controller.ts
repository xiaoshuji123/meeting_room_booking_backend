import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const admin = await this.adminService.login(loginDto);
    return {
      code: 200,
      message: '登录成功',
      data: admin,
    };
  }
}
