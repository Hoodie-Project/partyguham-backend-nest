import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PartyUserQueryRequestDto {
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
    description: `sort에 대한 조회 방법 (default = DESC)
    ASC = 오름 
    DESC = 내림차순`,
  })
  @IsIn(['ASC', 'DESC'])
  @IsString()
  @IsNotEmpty()
  public order: 'ASC' | 'DESC';

  @ApiProperty({
    enum: ['기획자', '디자이너', '개발자', '마케터/광고'],
    description: '직군 조회에 대한 선택 옵션',
  })
  @IsIn(['기획자', '디자이너', '개발자', '마케터/광고'])
  @IsString()
  @IsOptional()
  public main: string;
}
