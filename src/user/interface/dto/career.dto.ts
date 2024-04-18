import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsPositive, Max, Min } from 'class-validator';
import { CareerTypeEnum } from 'src/user/infra/db/entity/user-career.entity';

export class CareerDto {
  @ApiProperty({
    example: 1,
    description: '포지션 ID (position pk)',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly positionId: number;

  @ApiProperty({
    example: 1,
    description: '경력 연차',
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
