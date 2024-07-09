import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PartyUserParamRequestDto {
  @ApiProperty({
    example: 1,
    description: 'party ID (PK - 파티)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly partyId: number;

  @ApiProperty({
    example: 3,
    description: 'party user ID (PK - 파티 유저)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly partyUserId: number;
}
