import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

class PartyUser {
  @IsNotEmpty()
  @ApiProperty({ description: '파티 유저 권한' })
  authority: string;

  @IsNotEmpty()
  @ApiProperty({ description: '파티 포지션' })
  position: object;

  @IsNotEmpty()
  @ApiProperty({ description: '유저 정보' })
  user: object;
}

@Exclude()
export class GetPartyUserResponseDto {
  @Expose()
  @ApiProperty({
    example: [
      {
        authority: 'master',
        position: {
          id: 23,
          main: '개발자',
          sub: '백엔드',
        },
        user: {
          id: 1,
          nickname: 'mir2',
          image: null,
          userCareers: [
            {
              positionId: 1,
              years: 1,
            },
            {
              positionId: 2,
              years: 3,
            },
          ],
        },
      },
      {
        authority: 'deputy',
        position: {
          id: 34,
          main: '마케터 광고',
          sub: '컨텐츠 마케터',
        },
        user: {
          id: 17,
          nickname: 'mir5',
          image: null,
          userCareers: [],
        },
      },
    ],
    type: [PartyUser],
    description: `파티에 해당하는 유저 리스트

    < partyAdmin - authority >
    master = 파티장  
    deputy = 부파티장  
    `,
  })
  @IsNotEmpty()
  @Type(() => PartyUser)
  readonly partyAdmin: PartyUser[];

  @Expose()
  @ApiProperty({
    example: [
      {
        authority: 'member',
        position: {
          id: 15,
          main: '디자이너',
          sub: '공간 디자이너',
        },
        user: {
          id: 18,
          nickname: 'mir6',
          image: null,
          userCareers: [
            {
              positionId: 1,
              years: 2,
            },
          ],
        },
      },
      {
        authority: 'member',
        position: {
          id: 22,
          main: '개발자',
          sub: '프론트엔드',
        },
        user: {
          id: 15,
          nickname: 'mir3',
          image: null,
          userCareers: [],
        },
      },
    ],
    type: [PartyUser],
    description: `파티에 해당하는 유저 리스트  

    < partyUser - authority >  
    member = 파티원  
    `,
  })
  @IsNotEmpty()
  @Type(() => PartyUser)
  readonly partyUser: PartyUser[];
}
