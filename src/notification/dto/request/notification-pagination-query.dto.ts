import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max } from 'class-validator';

export class NotificationPaginationQueryDto {
  @ApiProperty({
    example: 10,
    description: '최대 조회 수',
  })
  @Max(10)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  public limit: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'cursor, 마지막 알람 ID',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  public cursor: number;
}
