import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'account',
    description: '계정',
  })
  @IsString()
  @IsNotEmpty()
  readonly account: string;

  @ApiProperty({
    example: 'nickname',
    description: '닉네임 2자 이상 30자 이하',
  })
  @MaxLength(30)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;

  @ApiProperty({
    example: 'email@party.com',
    description: '이메일 길이 최대 60',
  })
  @MaxLength(60)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
