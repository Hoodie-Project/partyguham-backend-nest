import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PartyRecruitmentIdsBodyRequestDto {
  @ApiProperty({
    description: `party recruitment ID (PK - 파티 모집 공고)  
    배열에 적용할 ID를 대입합니다.
    `,
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNotEmpty()
  public partyRecruitmentIds: number[];
}
