import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Exclude()
export class GetPartyResponseDto {
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
    example: '진행중',
    description: '진행중 / 종료',
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
    description: '파티상태',
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
    example: {
      status: 'active',
      createdAt: '2024-07-05T01:04:44.235Z',
      updatedAt: '2024-07-05T01:04:44.235Z',
      id: 80,
      userId: 1,
      partyId: 80,
      positionId: 1,
      authority: 'member',
    },
    description: `파티에 속한 내정보, 없을시 null 리턴`,
  })
  @IsNotEmpty()
  readonly myInfo: object | null;
}
