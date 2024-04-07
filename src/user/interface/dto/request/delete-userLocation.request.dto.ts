import { ApiProperty } from '@nestjs/swagger';

import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class DeleteUserLocationRequestDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'location id(pk) Array',
  })
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsNotEmpty()
  readonly deleteUserLocationIds: number[];
}
