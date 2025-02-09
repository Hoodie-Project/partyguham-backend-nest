import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class NicknameQueryRequestDto {
  @ApiProperty({
    example: 'nickname',
    description: '닉네임 2자 이상 15자 이하',
  })
  @MaxLength(15)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;
}
