import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Exclude()
export class PartyApplicationDto {
  @Expose()
  @ApiProperty({
    example: 3,
    description: 'party application ID (PK - 파티 지원자)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: '지원합니다~',
    description: '지원자 응답 메세지',
  })
  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @Expose()
  @ApiProperty({
    example: 'active',
    description: `지원자 상태  
    
    검토중 - active
    수락 - approved
    응답대기 - pending
    거절 - rejected`,
  })
  @IsNotEmpty()
  readonly status: object;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '지원일자',
  })
  @IsString()
  @IsNotEmpty()
  readonly createdAt: string;

  @Expose()
  @ApiProperty({
    example: {
      id: 1,
      nickname: 'mir2',
      image: '/image/..',
    },
    description: '포지션 정보',
  })
  @IsNotEmpty()
  readonly user: object;
}

export class PartyApplicationsResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: '총 데이터 갯수' })
  total: number;

  @Expose()
  @ApiProperty({ description: '파티 지원자 목록', type: [PartyApplicationDto] })
  @Type(() => PartyApplicationDto)
  partyApplicationUser: PartyApplicationDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.
}
