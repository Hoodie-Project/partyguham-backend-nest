import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsInt, IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';

export class CreateUserLocationRequestDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'location id(pk) Array',
  })
  @IsInt()
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // 중첩여부
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsNotEmpty()
  readonly locationIds: number[];
}
