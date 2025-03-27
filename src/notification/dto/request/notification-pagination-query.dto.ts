import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max } from 'class-validator';

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
    description: 'cursor, 커서를 포함하지 않고 데이터 리턴',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  public cursor: number;

  @ApiPropertyOptional({
    enum: ['party', 'recruit'],
    description: `
    party : 파티활동  
    recruit : 지원소식 `,
  })
  @IsIn(['party', 'recruit'])
  @IsString()
  @IsOptional()
  public type: string;
}
