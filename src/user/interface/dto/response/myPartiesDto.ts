import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class MyPartiesPositionDto {
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
export class PartyeDto {
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
  })
  @IsNotEmpty()
  @IsString()
  readonly image: string;

  @Expose()
  @ApiProperty({
    example: 'active',
    description: '유저 데이터 상태값',
  })
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
class PartyUsersResDto {
  @Expose()
  @ApiProperty({
    example: 1,
    description: 'Party User ID (PK - 파티 유저)',
  })
  @IsString()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '합류일',
  })
  @IsNotEmpty()
  @IsString()
  readonly createdAt: string;

  @Expose()
  @ApiProperty({
    type: MyPartiesPositionDto,
    description: '파티에 속한 나의 포지션',
  })
  @IsNotEmpty()
  @Type(() => MyPartiesPositionDto)
  readonly position: MyPartiesPositionDto;

  @Expose()
  @ApiProperty({
    type: PartyeDto,
    description: '파티 정보',
  })
  @IsNotEmpty()
  @Type(() => PartyeDto)
  readonly party: PartyeDto;
}

export class GetMyPartiesResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: '총 데이터 갯수' })
  total: number;

  @Expose()
  @ApiProperty({ description: '파티 데이터 목록', type: [PartyUsersResDto] })
  @Type(() => PartyUsersResDto)
  partyUsers: PartyUsersResDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.
}
