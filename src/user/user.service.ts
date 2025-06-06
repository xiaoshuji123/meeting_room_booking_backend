import { Injectable, Logger, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/user.vo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  private logger = new Logger();
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject()
  private redisService: RedisService;

  @Inject(ConfigService)
  private configService: ConfigService;

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

  async initData() {
    const user1 = new User();
    user1.username = '张三';
    user1.password = md5('123456');
    user1.email = 'zhangsan@qq.com';
    user1.nick_name = '管理员';

    const user2 = new User();
    user2.username = '李四';
    user2.password = md5('123456');
    user2.email = 'lisi@qq.com';
    user2.nick_name = '普通用户';

    const role1 = new Role();
    role1.name = '管理员';
    role1.description = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';
    role2.description = '普通用户';

    const permission1 = new Permission();
    permission1.code = 'admin';
    permission1.description = '管理员';

    const permission2 = new Permission();
    permission2.code = 'user';
    permission2.description = '普通用户';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission2];

    // 不能打乱顺序，因为存在外键依赖关系:
    // 1. 角色依赖权限，所以必须先创建权限
    // 2. 用户依赖角色，所以必须先创建角色
    // 所以必须按照 permission -> role -> user 的顺序保存
    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  async login(loginDto: LoginUserDto) {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { username }, relations: ['roles', 'roles.permissions'] });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (user.password !== md5(password)) {
      throw new BadRequestException('密码错误');
    }
    const loginUserVo = new LoginUserVo();
    loginUserVo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nick_name,
      email: user.email,
      headPic: user.head_pic,
      phone: user.phone,
      isFrozen: user.is_frozen,
      isAdmin: user.is_admin,
      createdTime: user.created_time,
      roles: user.roles.map((role) => role.name),
      permissions: user.roles.flatMap((role) => role.permissions.map((permission) => permission.code)),
    };
    return loginUserVo;
  }

  async generateToken(user: { id: number; username: string; roles: string[]; permissions: string[] }) {
    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      },
      {
        expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn: this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const data = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: data.userId },
        relations: ['roles', 'roles.permissions'],
      });
      const { accessToken, refreshToken } = await this.generateToken({
        id: user.id,
        username: user.username,
        roles: user.roles.map((role) => role.name),
        permissions: user.roles.flatMap((role) => role.permissions.map((permission) => permission.code)),
      });
      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('token 已过期，请重新登录');
    }
  }
}
