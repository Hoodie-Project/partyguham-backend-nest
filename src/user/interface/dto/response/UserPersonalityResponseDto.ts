import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserPersonalityResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 1 })
  userId: number;

  @Expose()
  @ApiProperty({ example: 1 })
  personalityOptionId: number;
}
