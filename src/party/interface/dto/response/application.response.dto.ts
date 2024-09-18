import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Exclude()
export class RecruitmentResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
    description: 'Party recruitments ID (PK - 파티모집)',
  })
  @IsString()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: 1,
    description: 'Party ID (PK - 파티)',
  })
  @IsString()
  @IsNotEmpty()
  readonly partyId: number;

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
    example: [
      {
        id: 4,
        userId: 12,
        partyRecruitmentId: 27,
        message: '참여희망',
        createdAt: '2024-07-02T05:44:43.632Z',
      },
      {
        id: 5,
        userId: 13,
        partyRecruitmentId: 27,
        message: '참여희망 1',
        createdAt: '2024-07-02T06:44:43.632Z',
      },
    ],
    description: 'party applications (지원자 정보)',
  })
  @IsNotEmpty()
  readonly applicationCount: object;
}
