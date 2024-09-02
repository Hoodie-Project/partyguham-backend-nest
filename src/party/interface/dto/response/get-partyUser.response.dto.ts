import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';

@Exclude()
export class GetPartyUserResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
    description: 'Party ID (PK - 파티)',
  })
  @IsString()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @ApiPropertyOptional({
    example: [
      {
        authority: 'master',
        position: {
          main: '개발자',
          sub: '백엔드',
        },
        user: {
          id: 12,
          nickname: 'mir2',
          image: null,
        },
      },
      {
        authority: 'deputy',
        position: {
          main: '마케터 광고',
          sub: '컨텐츠 마케터',
        },
        user: {
          id: 17,
          nickname: 'mir5',
          image: null,
        },
      },
      {
        authority: 'member',
        position: {
          main: '기획자',
          sub: 'UI/UX 기획자',
        },
        user: {
          id: 16,
          nickname: 'mir4',
          image: null,
        },
      },
      {
        authority: 'member',
        position: {
          main: '디자이너',
          sub: '공간 디자이너',
        },
        user: {
          id: 18,
          nickname: 'mir6',
          image: null,
        },
      },
      {
        authority: 'member',
        position: {
          main: '개발자',
          sub: '프론트엔드',
        },
        user: {
          id: 15,
          nickname: 'mir3',
          image: null,
        },
      },
    ],
    description: 'partyUser list',
  })
  @IsNotEmpty()
  readonly partyUser: [
    {
      authority: PartyAuthority;
      position: {
        main: string;
        sub: string;
      };
      user: {
        id: number;
        nickname: string;
        image: string | null;
      };
    },
  ];

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
}
