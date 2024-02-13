import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePartyRequestDto {
  @ApiProperty({
    example: '파티구함',
    description: '제목',
  })
  @IsString()
  @IsOptional()
  readonly title: string;

  @ApiProperty({
    example: '풀스텍 구함',
    description: '본문',
  })
  @IsString()
  @IsOptional()
  readonly content: string;
}
