import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class LocationDto {
  @ApiProperty({
    example: 1,
    description: '지역 ID',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly id: number;
}
