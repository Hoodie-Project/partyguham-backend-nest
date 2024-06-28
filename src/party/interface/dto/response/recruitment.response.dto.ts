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
    example: {
      id: 1,
      main: '기획',
      sub: 'UI/UX 기획자',
    },
    description: 'Position ID (포지션 정보)',
  })
  @IsNotEmpty()
  readonly position: object;

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
}
