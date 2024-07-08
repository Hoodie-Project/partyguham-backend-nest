import { ApiProperty } from '@nestjs/swagger';
import { File } from 'buffer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PartyDelegationRequestDto {
  @ApiProperty({
    example: 1,
    description: '파티장 권한을 위임할 유저 ID',
  })
  @IsOptional()
  readonly delegateUserId: number;
}
