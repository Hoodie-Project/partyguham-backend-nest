import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class GetAdminPartyUserResponseDto {
  @Expose()
  @ApiProperty({
    example: [
      {
        createdAt: '2024-07-05T01:04:44.235Z',
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
        createdAt: '2024-07-05T01:04:44.235Z',
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
        createdAt: '2024-07-05T01:04:44.235Z',
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
    ],
    description: `파티원 리스트
    `,
  })
  @IsNotEmpty()
  readonly partyUser: [];
}
