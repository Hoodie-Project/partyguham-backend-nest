import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsIn, IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'nickname',
    description: '닉네임 2자 이상 15자 이하',
  })
  @MaxLength(15)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;

  @ApiProperty({
    description: 'M: 남성, F: 여성',
    example: 'M',
  })
  @Length(1, 1)
  @IsIn(['M', 'F'])
  @IsString()
  @IsNotEmpty()
  public gender: string;

  @ApiProperty({
    description: '생년월일',
    example: '2024-01-01',
  })
  @Length(10)
  @IsISO8601()
  @IsNotEmpty()
  public birth: string;
}
