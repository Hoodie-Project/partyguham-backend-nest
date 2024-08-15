import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, Max, Min } from 'class-validator';

export class CreatePartyRecruitmentRequestDto {
  @ApiProperty({
    example: 1,
    description: 'Position ID (PK - 포지션)',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly positionId: number;

  @ApiProperty({
    example: 1,
    description: '모집인원',
  })
  @Max(16)
  @Min(0)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly recruiting_count: number;
}
