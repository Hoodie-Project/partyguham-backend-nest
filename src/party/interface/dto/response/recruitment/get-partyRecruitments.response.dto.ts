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
    example: '2024-06-07T12:17:57.248Z',
    description: '생성일자',
  })
  @IsString()
  @IsNotEmpty()
  readonly createdAt: string;

  @Expose()
  @ApiProperty({
    example: {
      id: 1,
      title: '제목2',
      image: '/uploads/images/party/1718338843645-484895188-스크린샷 2024-03-03 오후 5.08.26.png',
      partyType: {
        id: 1,
        type: '미정',
      },
    },
    description: '파티 제목/이미지',
  })
  @IsNotEmpty()
  readonly party: object;

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
