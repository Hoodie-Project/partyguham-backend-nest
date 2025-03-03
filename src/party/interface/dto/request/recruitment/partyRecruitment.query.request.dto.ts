import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PartyRecruitmentQueryRequestDto {
  @ApiProperty({
    enum: ['createdAt'],
    description: `모집 조회 방법 / order에 대한 조회 기준 (default = createdAt) 
    createdAt = 생성순
    `,
  })
  @IsIn(['createdAt'])
  @IsString()
  @IsNotEmpty()
  public sort: string;

  @ApiProperty({
    enum: ['ASC', 'DESC'],
    description: `sort에 대한 조회 방법 (default = ASC)
    ASC = 오름 
    DESC = 내림차순`,
  })
  @IsIn(['ASC', 'DESC'])
  @IsString()
  @IsNotEmpty()
  public order: 'ASC' | 'DESC';

  @ApiProperty({
    enum: ['active', 'completed'],
    description: `파티모집 공고 상태   
    active - 모집중  
    completed - 모집완료  
    값을 넣지 않으면 모든 조건 값에 대해 조회
    `,
  })
  @IsIn(['active', 'completed'])
  @IsString()
  @IsOptional()
  readonly status: 'active' | 'completed';

  @ApiPropertyOptional({
    enum: ['기획자', '디자이너', '개발자', '마케터/광고'],
    description: '직군 조건 조회 (선택 옵션)',
  })
  @IsIn(['기획자', '디자이너', '개발자', '마케터/광고'])
  @IsString()
  @IsOptional()
  public main: string;
}
