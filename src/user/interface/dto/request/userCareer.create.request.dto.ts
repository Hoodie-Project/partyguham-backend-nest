import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsNotEmpty } from 'class-validator';

import { CareerDto } from '../career.dto';

export class UserCareerCreateRequestDto {
  @ApiProperty({
    example: [{ positionId: 1, years: 1, careerType: 'primary' }],
    description: '경력 저장',
  })
  @Type(() => CareerDto)
  @ArrayUnique()
  @ArrayMaxSize(2)
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  readonly career: CareerDto[];
}
