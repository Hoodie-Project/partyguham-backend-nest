import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { CareerDto } from '../career.dto';

export class UserCareerCreateRequestDto {
  @ApiProperty({
    description: '경력 저장',
    type: [CareerDto],
  })
  @Type(() => CareerDto)
  @ValidateNested({ each: true })
  @ArrayUnique()
  @ArrayMaxSize(2)
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  readonly career: CareerDto[];
}
