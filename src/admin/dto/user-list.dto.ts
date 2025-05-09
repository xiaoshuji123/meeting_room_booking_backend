import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";  
export class UserListDto {
  @ApiProperty({ description: '页码', required: true })
  @IsNotEmpty({   
    message: '页码不能为空',
  })
  @IsNumber({}, {
    message: '页码必须为数字',
  })
  pageNumber: number;

  @ApiProperty({ description: '每页条数', required: true })
  @IsNotEmpty({
    message: '每页条数不能为空',
  })
  @IsNumber({}, {
    message: '每页条数必须为数字',
  })
  pageSize: number;

  @ApiProperty({ description: '昵称', required: false })
  nickName: string;

  @ApiProperty({ description: '用户名', required: false })
  username: string;

  @ApiProperty({ description: '邮箱', required: false })
  email: string;
}
