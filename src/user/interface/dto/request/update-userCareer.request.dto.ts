import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class UpdateCareerDto {
  @ApiProperty({
    example: 1,
    description: 'userCareer ID',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly id: number;

  @ApiPropertyOptional({
    example: 1,
    description: '포지션 ID (position pk)',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly positionId: number;

  @ApiPropertyOptional({
    example: 1,
    description: '경력 연차',
  })
  @Max(100)
  @Min(0)
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly years: number;
}

export class UpdateUserCareerRequestDto {
  @ApiProperty({
    description: '경력 저장',
    type: [UpdateCareerDto],
  })
  @Type(() => UpdateCareerDto)
  @ValidateNested({ each: true })
  @ArrayUnique()
  @ArrayMaxSize(2)
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  career: UpdateCareerDto[];
}
