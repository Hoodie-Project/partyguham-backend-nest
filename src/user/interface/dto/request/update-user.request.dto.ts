import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserRequestDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'position id(pk)',
  })
  @IsInt()
  @IsOptional()
  readonly positionId: number[];
}
