import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UsersMePartyQueryDto {
  @ApiProperty({
    example: 1,
    description: 'page',
  })
  @IsInt()
  @IsNotEmpty()
  public page: number;

  @ApiProperty({
    example: 5,
    description: '최대 조회 수',
  })
  @IsInt()
  @IsNotEmpty()
  public limit: number;

  @ApiProperty({
    enum: ['createdAt'],
    description: 'createdAt - 파티 참여일, order 조회 기준',
  })
  @IsIn(['createdAt'])
  @IsString()
  @IsNotEmpty()
  public sort: string;

  @ApiProperty({
    enum: ['ASC', 'DESC'],
    description: 'sort - 오름, 내림차순',
  })
  @IsIn(['ASC', 'DESC'])
  @IsString()
  @IsNotEmpty()
  public order: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    enum: ['active', 'archived'],
    description: `파티 상태
    active - 진행중
    archived - 종료
    `,
  })
  @IsString()
  @IsOptional()
  public status: string;
}
