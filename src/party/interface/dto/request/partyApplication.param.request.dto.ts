import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PartyApplicationParamRequestDto {
  @ApiProperty({
    example: 1,
    description: 'party ID (PK - 파티)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly partyId: number;

  @ApiProperty({
    example: 3,
    description: 'party recruitment ID (PK - 파티 모집)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly partyRecruitmentId: number;

  @ApiProperty({
    example: 3,
    description: 'party application ID (PK - 파티 지원)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly partyApplicationId: number;
}
