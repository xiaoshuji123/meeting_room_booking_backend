import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Like } from 'typeorm';
import { UserListDto } from './dto/user-list.dto';
import { UserListVo } from './vo/user.vo';

@Injectable()
export class AdminService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async freezeUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    user.is_frozen = true;
    await this.userRepository.save(user);
  }

  async userList({ pageNumber = 1, pageSize = 10, nickName, username, email }: UserListDto) {
    const skip = (pageNumber - 1) * pageSize;
    const condition: Record<string, any> = {};
    if (nickName) {
      condition.nick_name = Like(`%${nickName}%`);
    }
    if (username) {
      condition.username = Like(`%${username}%`);
    }
    if (email) {
      condition.email = Like(`%${email}%`);
    }
    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: pageSize,
      where: condition,
    });
    const userVo = new UserListVo();
    userVo.total = total;
    userVo.users = users;
    return userVo;
  }
}
