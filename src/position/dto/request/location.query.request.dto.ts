import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class PositionQueryRequestDto {
  @ApiProperty({
    enum: ['기획자', '디자이너', '개발자', '마케터/광고'],
    description: 'main position query',
  })
  @IsIn(['기획자', '디자이너', '개발자', '마케터/광고'])
  @IsString()
  @IsOptional()
  readonly main: string;
}
