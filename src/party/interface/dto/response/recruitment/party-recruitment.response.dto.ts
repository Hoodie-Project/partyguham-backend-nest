import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@Exclude()
export class RecruitmentPartyeDto {
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
    example: 'active',
    description: '파티 상태 active - 진행중, archived - 종료(보관됨)',
  })
  @IsNotEmpty()
  @IsString()
  readonly status: string;

  @Expose()
  @ApiProperty({
    example: {
      type: '포트폴리오',
    },
    description: '파티 타입',
  })
  @IsNotEmpty()
  readonly partyType: object;
}

@Exclude()
export class RecruitmentPositionDto {
  @Expose()
  @ApiProperty({
    example: '기획',
    description: 'Position Main (직군)',
  })
  @IsNotEmpty()
  readonly main: string;

  @Expose()
  @ApiProperty({
    example: 'UI/UX 기획자',
    description: 'Position Sub (직무)',
  })
  @IsNotEmpty()
  readonly sub: string;
}

@Exclude()
export class PartyRecruitmentResponseDto {
  @Expose()
  @ApiProperty({
    type: RecruitmentPartyeDto,
    description: '파티 정보',
  })
  @IsNotEmpty()
  @Type(() => RecruitmentPartyeDto)
  readonly party: RecruitmentPartyeDto;

  @Expose()
  @ApiProperty({
    type: RecruitmentPositionDto,
    description: '모집 포지션',
  })
  @IsNotEmpty()
  @Type(() => RecruitmentPositionDto)
  readonly position: RecruitmentPositionDto;

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
    example: 3,
    description: '현재 지원수',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly applicationCount: number;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '모집공고 생성일자 (모집일)',
  })
  @IsString()
  @IsNotEmpty()
  readonly createdAt: string;
}
