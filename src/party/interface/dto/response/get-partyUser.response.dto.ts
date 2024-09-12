import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class GetPartyUserResponseDto {
  @Expose()
  @ApiProperty({
    example: [
      {
        authority: 'master',
        position: {
          main: '디자이너',
          sub: 'UI/UX',
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
    ],
    description: `파티에 해당하는 유저 리스트

    < partyUser - authority >
    master = 파티장
    deputy = 부파티장
    `,
  })
  @IsNotEmpty()
  readonly partyAdmin: [];

  @Expose()
  @ApiProperty({
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
    ],
    description: `파티에 해당하는 유저 리스트

    < partyUser - authority >
    member = 파티원
    `,
  })
  @IsNotEmpty()
  readonly partyUser: [];
}
