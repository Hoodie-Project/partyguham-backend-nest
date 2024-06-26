import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, Max, Min } from 'class-validator';

export class RecruitmentRequestDto {
  @ApiProperty({
    example: 1,
    description: '포지션 ID (position pk)',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly positionId: number;

  @ApiProperty({
    example: 1,
    description: '모집인원',
  })
  @Max(10)
  @Min(0)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly recruiting_count: number;
}
