import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({ // forRootAsync 的方式 比 forRoot 更灵活，可配置
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('db_host'),
          port: configService.get('db_port'),
          username: configService.get('db_username'),
          password: configService.get('db_password'),
          database: configService.get('db_database'),
          entities: [User, Role, Permission],
          synchronize: true,
          logging: true,
          poolSize: configService.get('db_poolSize'),
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        }
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: { expiresIn: '30m' },
        }
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['src/.env'],
    }),
    UserModule,
    RedisModule,
    EmailModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
