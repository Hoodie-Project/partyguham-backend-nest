import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, ValidateNested } from 'class-validator';
import { UserLocation } from '../userLocation';

export class UserLocationUpdateRequestDto {
  @ApiProperty({
    example: UserLocation,
    description: '유저 관심지역 업데이트 목록',
    type: [UserLocation],
  })
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserLocation)
  userLocations: UserLocation[];
}
