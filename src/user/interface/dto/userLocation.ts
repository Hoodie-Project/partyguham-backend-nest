import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UserLocation {
  @ApiProperty({
    example: 1,
    description: '유저관심지역 ID',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({
    example: 1,
    description: '지역 ID',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly locationId: number;
}
