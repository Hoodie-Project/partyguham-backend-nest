import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class PartyUserResponseDto {
  @Expose()
  @ApiProperty({
    example: {
      id: 12,
      nickname: 'mir2',
      image: null,
    },
    description: '유저 데이터',
  })
  readonly user: string;

  @Expose()
  @ApiProperty({
    example: 'master',
    description: '권한',
  })
  readonly authority: string;

  @Expose()
  @ApiProperty({
    example: {
      main: '개발자',
      sub: '백엔드',
    },
    description: '유저 포지션',
  })
  readonly position: string;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '참여일자',
  })
  readonly createdAt: string;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '유저 최근 수정일자',
  })
  readonly updateAt: string;

  @Expose()
  @ApiProperty({
    example: 'active',
    description: '유저 데이터 상태값',
  })
  readonly status: string;
}

export class GetAdminPartyUsersResponseDto {
  @Expose()
  @ApiProperty({ example: 16, description: '파티에 속한 모든 partyUser 데이터 갯수' })
  totalPartyUserCount: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'partyUser 데이터 갯수' })
  total: number;

  @Expose()
  @ApiProperty({ description: '파티 데이터 목록', type: [PartyUserResponseDto] })
  // @Type(() => PartyUserResponseDto)
  partyUser: PartyUserResponseDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.
}
