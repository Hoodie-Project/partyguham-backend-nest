import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PartyRecruitmentParamRequestDto {
  @ApiProperty({
    example: 3,
    description: 'party recruitment ID (PK - 파티 모집)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly partyRecruitmentId: number;
}
