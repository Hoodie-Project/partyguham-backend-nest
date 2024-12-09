import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateUserResponseDto {
  @Expose()
  @ApiProperty({
    example: 'partyguam@hoodiev.com',
    description: '이메일',
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: '후디브',
    description: '닉네임',
  })
  nickname: string;

  @Expose()
  @ApiProperty({
    example: '1995-03-21',
    description: '생년월일',
  })
  birth: string;

  @Expose()
  @ApiProperty({
    example: true,
    description: '생일 공개 여부',
  })
  birthVisible: boolean;

  @Expose()
  @ApiProperty({
    example: 'M',
    description: '성별(M / F)',
  })
  gender: string;

  @Expose()
  @ApiProperty({
    example: true,
    description: '성별 공개 여부',
  })
  genderVisible: boolean;

  @Expose()
  @ApiProperty({
    description: '포트폴리오 제목',
    example: '포트폴리오 제목',
  })
  public portfolioTitle: string;

  @Expose()
  @ApiProperty({
    description: '포트폴리오 링크',
    example: 'https://example.com/..',
  })
  public portfolio: string;

  @Expose()
  @ApiProperty({
    example: '/image/..',
    description: '이미지 경로',
  })
  image: string;

  @Expose()
  @ApiProperty({
    example: '2024-06-03T03:21:21.943Z',
    description: '유저 생성일',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T03:21:21.943Z',
    description: '유저 수정일',
  })
  updatedAt: Date;
}
