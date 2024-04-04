import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class UpdateUserLocationItemRequestDto {
  @ApiProperty({
    example: 1,
    description: 'user_location_id(pk) Array',
  })
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({
    example: 1,
    description: 'location_id(pk) Array',
  })
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsNotEmpty()
  readonly locationId: number;
}

export class UpdateUserLocationRequestDto {
  @ApiProperty({
    example: UpdateUserLocationItemRequestDto,
    description: 'update',
    type: [UpdateUserLocationItemRequestDto],
  })
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserLocationItemRequestDto)
  update: UpdateUserLocationItemRequestDto[];
}

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
  readonly userLocationIds: number[];
}
