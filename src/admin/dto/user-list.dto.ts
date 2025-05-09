import { IsNotEmpty, IsNumber } from "class-validator";

export class UserListDto {
  @IsNotEmpty({   
    message: '页码不能为空',
  })
  @IsNumber({}, {
    message: '页码必须为数字',
  })
  pageNumber: number;

  @IsNotEmpty({
    message: '每页条数不能为空',
  })
  @IsNumber({}, {
    message: '每页条数必须为数字',
  })
  pageSize: number;

  nickName: string;
  username: string;
  email: string;
}
