import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
class PartiesDto {
  @Expose()
  @ApiProperty({
    example: 1,
    description: 'Party ID (PK - 파티)',
  })
  @IsString()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: {
      id: 1,
      type: '미정',
    },
    description: 'Party Type ID (PK - 파티 타입)',
  })
  @IsNotEmpty()
  readonly partyType: object;

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
    example: '풀스텍 구함',
    description: '본문',
  })
  @IsNotEmpty()
  @IsString()
  readonly content: string;

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
    example: '2024-06-07T12:17:57.248Z',
    description: '생성일자',
  })
  @IsNotEmpty()
  @IsString()
  readonly createdAt: string;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '수정일자',
  })
  @IsNotEmpty()
  @IsString()
  readonly updatedAt: string;

  @Expose()
  @ApiProperty({
    example: 1,
    description: '모집공고 갯수',
  })
  @IsString()
  @IsNotEmpty()
  readonly recruitmentCount: number;
}

export class GetPartiesResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: '총 데이터 갯수' })
  total: number;

  @Expose()
  @ApiProperty({ description: '파티 데이터 목록', type: [PartiesDto] })
  @Type(() => PartiesDto)
  parties: PartiesDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.
}
