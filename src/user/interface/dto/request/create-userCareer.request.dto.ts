import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { CareerTypeEnum } from 'src/user/infra/db/entity/user-career.entity';

export class CareerDto {
  @ApiProperty({
    example: 1,
    description: 'Position id(pk)',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly positionId: number;

  @ApiProperty({
    example: 1,
    description: 'year',
  })
  @Max(100)
  @Min(0)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly years: number;

  @ApiProperty({ enum: ['primary', 'secondary'], description: '주 / 부' })
  @IsIn([CareerTypeEnum.PRIMARY, CareerTypeEnum.SECONDARY])
  @IsNotEmpty()
  readonly careerType: CareerTypeEnum;
}

export class CreateUserCareerRequestDto {
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
