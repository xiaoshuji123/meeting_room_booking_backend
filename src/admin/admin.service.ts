import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { md5 } from 'src/utils';  
import { InjectRepository } from '@nestjs/typeorm'; 

@Injectable()
export class AdminService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { username }, relations: ['roles', 'roles.permissions'] });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (password !== md5(password)) {
      throw new BadRequestException('密码错误');
    }
    return user;
  }
}
