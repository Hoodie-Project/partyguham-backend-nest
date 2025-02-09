import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PartyRequestDto {
  @ApiProperty({
    example: 1,
    description: 'party ID (PK - 파티)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly partyId: number;
}
