import { Injectable, Logger, Inject, BadRequestException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
@Injectable()
export class UserService {
  private logger = new Logger();
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject()
  private redisService: RedisService;

  async register({ email, captcha, username, nick_name, password }: RegisterUserDto) {
    // 1. 验证验证码
    // 2.根据用户名查询用户，如果用户存在，则抛出异常，如果用户不存在，则创建用户
    // 3.保存用户到数据库
    const redisCaptcha = await this.redisService.get(`captcha_${email}`);
    if (!redisCaptcha) {
      throw new BadRequestException('验证码不存在');
    }
    if (redisCaptcha !== captcha) {
      throw new BadRequestException('验证码错误');
    }

    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new BadRequestException('用户已存在');
    }

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = md5(password);
    newUser.nick_name = nick_name;
    try {
      await this.userRepository.save(newUser);
      return {
        code: 200,
        message: '注册成功',
      };
    } catch (error) {
      this.logger.error(error, UserService);
      throw new BadRequestException('注册失败');
    }
  }
}
