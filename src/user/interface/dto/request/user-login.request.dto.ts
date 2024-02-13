import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLoginRequestDto {
  @ApiProperty({
    example: 'accesstokencode',
    description: '서버에서 제공한 access token',
  })
  @IsNotEmpty()
  accessToken: string;
}
