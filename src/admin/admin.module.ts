import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/user/entities/role.entity';
import { Permission } from 'src/user/entities/permission.entity';
@Module({
  controllers: [AdminController],
  providers: [AdminService, UserService],
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
})
export class AdminModule {}
