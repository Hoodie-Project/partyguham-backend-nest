import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PartyRequestDto {
  @ApiProperty({
    example: '파티 고유 ID',
    description: '파티고유ID',
  })
  @IsInt()
  @IsNotEmpty()
  readonly partyId: number;
}
