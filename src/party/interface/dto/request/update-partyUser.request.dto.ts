import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePartyUserRequestDto {
  @ApiProperty({
    example: 1,
    description: 'position ID (PK - 포지션)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly positionId: number;
}
