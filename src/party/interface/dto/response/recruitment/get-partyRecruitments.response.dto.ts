import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class RecruitmentPositionDto {
  @Expose()
  @ApiProperty({
    example: 3,
    description: 'position ID (PK - 포지션)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

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
export class RecruitmentPartyeDto {
  @Expose()
  @ApiProperty({
    example: 3,
    description: 'Party ID (PK - 파티)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

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
    nullable: true,
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
export class PartyRecruitmentDto {
  @Expose()
  @ApiProperty({
    example: 3,
    description: 'party recruitment ID (PK - 파티 모집)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

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
    example: 'active',
    description: '파티모집 공고 상태 active - 모집중, completed - 모집완료',
  })
  @IsNotEmpty()
  @IsString()
  readonly status: string;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '생성일자',
  })
  @IsString()
  @IsNotEmpty()
  readonly createdAt: string;

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
}

export class GetPartyRecruitmentsResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: '총 데이터 갯수' })
  total: number;

  @Expose()
  @ApiProperty({ description: '파티 데이터 목록', type: [PartyRecruitmentDto] })
  @Type(() => PartyRecruitmentDto)
  partyRecruitments: PartyRecruitmentDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.
}
