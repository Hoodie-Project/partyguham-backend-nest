import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
} from 'class-validator';

export class PersonalityDto {
  @ApiProperty({
    example: 1,
    description: 'questionId(pk)',
  })
  @Max(4)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly questionId: number;

  @ApiProperty({
    example: 1,
    description: 'optionId(pk)',
  })
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  @ArrayUnique()
  @ArrayMaxSize(2)
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  readonly optionId: number[];
}

export class CreateUserPersonalityRequestDto {
  @ApiProperty({
    example: [{ questionId: 1, optionId: [1, 2] }],
    description: '성향 저장',
  })
  @Type(() => PersonalityDto)
  @ArrayUnique()
  @IsArray()
  @IsNotEmpty()
  readonly personality: PersonalityDto[];
}
