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
  Max,
  Min,
} from 'class-validator';

export class UserCareerDto {
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
  @Max(50)
  @Min(0)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly years: number;
}

export class CreateUserCareerRequestDto {
  @ApiProperty({
    description: '주 경력',
    type: UserCareerDto,
  })
  @Type(() => UserCareerDto)
  @IsNotEmpty()
  readonly primary: UserCareerDto;

  @ApiProperty({
    description: '부 경력',
    type: UserCareerDto,
  })
  @Type(() => UserCareerDto)
  @IsOptional()
  readonly secondary: UserCareerDto;

  @ApiProperty({
    description: '기타 경력',
    type: UserCareerDto,
  })
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @ArrayUnique()
  @Type(() => UserCareerDto)
  @IsArray()
  @IsOptional()
  readonly other: UserCareerDto[];
}
