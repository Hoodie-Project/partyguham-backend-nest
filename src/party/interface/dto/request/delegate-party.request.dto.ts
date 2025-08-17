import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PartyDelegationRequestDto {
  @ApiProperty({
    example: 1,
    description: '파티장 권한을 위임할 party user ID (PK - 파티유저)',
  })
  @IsNotEmpty()
  readonly partyUserId: number;
}
