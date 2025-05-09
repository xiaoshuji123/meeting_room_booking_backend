import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class LoginUserDto {
  @ApiProperty({ description: '用户名', required: true })
  @IsNotEmpty({ 
    message: '用户名不能为空',
  })
  username: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
