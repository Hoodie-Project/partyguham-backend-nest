import { ApiProperty } from '@nestjs/swagger';

import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { LocationDto } from '../location.dto';

export class UserLocationCreateRequestDto {
  @ApiProperty({
    description: '지역 ID 목록 (Array)',
    type: [LocationDto],
  })
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsNotEmpty()
  readonly locations: LocationDto[];
}
