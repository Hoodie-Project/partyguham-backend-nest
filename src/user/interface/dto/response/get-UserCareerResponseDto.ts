import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class GetUserCareerResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
    description: 'userCareer ID',
  })
  readonly id: number;

  @Expose()
  @ApiProperty({ example: 1 })
  @Type(() => PositionDto)
  position: number;

  @Expose()
  @ApiProperty({ example: 1 })
  years: number;

  @Expose()
  @ApiProperty({ enum: ['primary', 'secondary', 'other'] })
  careerType: string;
}

@Exclude()
export class PositionDto {
  @Expose()
  @ApiProperty({
    example: 1,
    description: 'Position ID',
  })
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: '기획',
    description: 'Position Main (직군)',
  })
  readonly main: string;

  @Expose()
  @ApiProperty({
    example: 'UI/UX 기획자',
    description: 'Position Sub (직무)',
  })
  readonly sub: string;
}
