import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Exclude()
export class PartyResponseDto {
  @Expose()
  @ApiProperty({
    example: '1',
    description: 'party PK',
  })
  @IsString()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: {
      id: 1,
      title: '미정',
    },
    description: 'partyType FK',
  })
  @IsNotEmpty()
  readonly partyType: object;

  @Expose()
  @ApiPropertyOptional({
    example: { user: { id: 1, nickname: 'mir', image: '/uploads' } },
    description: 'partyUser list',
  })
  @IsOptional()
  readonly partyUser: [{ user: { id: number; nickname: string; image: string } }];

  @Expose()
  @ApiProperty({
    example: '모집중',
    description: '진행중 / 모집중 / 파티종료',
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
    example: 'active',
    description: '파티상태',
  })
  @IsNotEmpty()
  @IsString()
  readonly createdAt: string;

  @Expose()
  @ApiProperty({
    example: 'active',
    description: '파티상태',
  })
  @IsNotEmpty()
  @IsString()
  readonly updatedAt: string;
}

export class PartiesResponseDto {
  @Expose()
  @ApiProperty({ type: [PartyResponseDto] })
  @Type(() => PartyResponseDto)
  parties: PartyResponseDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.

  @Expose()
  @ApiProperty()
  count: number;
}
