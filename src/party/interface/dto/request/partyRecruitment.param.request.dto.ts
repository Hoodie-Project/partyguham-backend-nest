import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PartyRecruitmentParamRequestDto {
  @ApiProperty({
    example: 1,
    description: '파티 ID (party_id)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly partyId: number;

  @ApiProperty({
    example: 3,
    description: '파티 모집 ID (party_recruitment_id)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly partyRecruitmentId: number;
}
