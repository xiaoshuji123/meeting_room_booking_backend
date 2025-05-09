import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FreezeDto {
  @ApiProperty({ description: '用户ID', required: true })
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

