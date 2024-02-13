import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserParamRequestDto {
  @ApiProperty({
    example: 'nickname',
    description: '닉네임 2자 이상 30자 이하',
  })
  @MaxLength(30)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  public nickname: string;
}
