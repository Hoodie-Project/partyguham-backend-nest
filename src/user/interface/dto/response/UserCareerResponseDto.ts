import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserCareerResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 1 })
  userId: number;

  @Expose()
  @ApiProperty({ example: 1 })
  positionId: number;

  @Expose()
  @ApiProperty({ example: 1 })
  years: number;

  @Expose()
  @ApiProperty({ enum: ['primary', 'secondary', 'other'] })
  careerType: string;
}
