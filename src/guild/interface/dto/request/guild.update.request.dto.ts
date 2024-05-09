import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GuildUpdateRequestDto {
  @ApiProperty({
    example: '후디브 길드',
    description: '제목',
  })
  @IsString()
  @IsOptional()
  readonly title: string;

  @ApiProperty({
    example: '후디브는 후드개발자 라는 뜻 입니다',
    description: '본문',
  })
  @IsString()
  @IsOptional()
  readonly content: string;
}
