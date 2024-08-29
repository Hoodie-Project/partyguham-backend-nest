import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, Max, Min } from 'class-validator';

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
    example: '해당 포지션에서 다양한 툴을 사용가능한 사람을 모집해요!',
    description: '모집에 대한 본문',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

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
