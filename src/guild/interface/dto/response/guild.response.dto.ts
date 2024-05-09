import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class GuildResponseDto {
  @Expose()
  @ApiProperty({
    example: '후디브',
    description: '제목',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @Expose()
  @ApiProperty({
    example: '후디브는 후디 + 개발자',
    description: '본문',
  })
  @IsNotEmpty()
  @IsString()
  readonly content: string;
}

export class GuildsResponseDto {
  @ApiProperty()
  data: GuildResponseDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.

  @ApiProperty()
  count: number;
}
