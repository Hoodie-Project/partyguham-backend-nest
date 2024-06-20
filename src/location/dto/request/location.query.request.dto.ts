import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class LocationQueryRequestDto {
  @ApiProperty({
    enum: [
      '서울',
      '경기',
      '인천',
      '강원',
      '충북',
      '충남',
      '세종',
      '대전',
      '광주',
      '전북',
      '전남',
      '경북',
      '경남',
      '울산',
      '부산',
      '제주',
    ],
    description: 'location query',
  })
  @IsIn([
    '서울',
    '경기',
    '인천',
    '강원',
    '충북',
    '충남',
    '세종',
    '대전',
    '광주',
    '전북',
    '전남',
    '경북',
    '경남',
    '울산',
    '부산',
    '제주',
  ])
  @IsString()
  @IsOptional()
  readonly province: string;
}
