import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PartyUserQueryRequestDto {
  @ApiProperty({
    example: 1,
    description: '페이지',
  })
  @IsInt()
  @IsNotEmpty()
  public page: number;

  @ApiProperty({
    example: 5,
    description: '요청 받을 데이터 갯수',
  })
  @IsInt()
  @IsNotEmpty()
  public limit: number;

  @ApiProperty({
    enum: ['createdAt'],
    description: `order에 대한 조회 기준 (default = createdAt) 
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

  @ApiPropertyOptional({
    enum: ['기획자', '디자이너', '개발자', '마케터/광고'],
    description: '직군 조건 조회 (선택 옵션)',
  })
  @IsIn(['기획자', '디자이너', '개발자', '마케터/광고'])
  @IsString()
  @IsOptional()
  public main: string;

  @ApiPropertyOptional({
    description: '닉네임 조건 조회 (선택 옵션)',
  })
  @IsString()
  @IsOptional()
  public nickname: string;
}
