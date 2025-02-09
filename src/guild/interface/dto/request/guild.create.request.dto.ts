import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GuildCreateRequestDto {
  @ApiProperty({
    example: '후디브',
    description: '제목',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: '환상의 나라로 오세요',
    description: '본문',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
