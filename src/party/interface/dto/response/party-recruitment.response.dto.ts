import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Exclude()
export class PartyRecruitmentResponseDto {
  @Expose()
  @ApiProperty({
    example: '진행중',
    description: '진행중 / 파티완료 / 파티종료',
  })
  @IsNotEmpty()
  readonly tag: string;

  @Expose()
  @ApiProperty({
    example: '파티구함',
    description: '제목',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @Expose()
  @ApiProperty({
    example: '/uploads/...',
    description: '이미지 서버 경로',
  })
  @IsNotEmpty()
  @IsString()
  readonly image: string;

  @Expose()
  @ApiProperty({
    example: '미정',
    description: '파티 타입',
  })
  @IsNotEmpty()
  readonly partyType: object;

  @Expose()
  @ApiProperty({
    example: '기획',
    description: 'Position Main (직군)',
  })
  @IsNotEmpty()
  readonly main: object;

  @Expose()
  @ApiProperty({
    example: 'UI/UX 기획자',
    description: 'Position Sub (직무)',
  })
  @IsNotEmpty()
  readonly sub: object;

  @Expose()
  @ApiProperty({
    example: '해당 포지션에서 다양한 툴을 사용가능한 사람을 모집해요!',
    description: '모집에 대한 본문',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @Expose()
  @ApiProperty({
    example: 2,
    description: '모집인원',
  })
  @IsNotEmpty()
  readonly recruitingCount: number;

  @Expose()
  @ApiProperty({
    example: 1,
    description: '모집된 인원',
  })
  @IsNotEmpty()
  readonly recruitedCount: number;

  @Expose()
  @ApiProperty({
    example: 1,
    description: '현재 지원수',
  })
  @IsNotEmpty()
  readonly applicationCount: object;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '생성일자',
  })
  @IsString()
  @IsNotEmpty()
  readonly createdAt: string;
}
