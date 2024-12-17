import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class mePartyApplicationQueryDto {
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
    enum: ['pending', 'processing', 'approved', 'rejected'],
    description: `파티 지원자 상태  

    검토중 - pending
    응답대기 - processing
    수락 - approved
    거절 - rejected
    `,
  })
  @IsIn(['pending', 'processing', 'approved', 'rejected'])
  @IsString()
  @IsOptional()
  public status: string;
}
