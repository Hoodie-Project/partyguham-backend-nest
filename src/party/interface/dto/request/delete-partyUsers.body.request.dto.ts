import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeletePartyUsersBodyRequestDto {
  @ApiProperty({
    description: `party recruitment ID (PK - 파티 모집 공고)  
    , ID를 구별하여 삭제합니다.
    `,
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNotEmpty()
  public partyUserIds: number[];
}
