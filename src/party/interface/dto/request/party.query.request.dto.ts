import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PartyQueryRequestDto {
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
    description: `order 조회 기준  
    
    - createdAt : 생성일  
    `,
  })
  @IsIn(['createdAt'])
  @IsString()
  @IsNotEmpty()
  public sort: string;

  @ApiProperty({
    enum: ['ASC', 'DESC'],
    description: `조회 방법
    
    - ASC (오름차순)  
    - DESC (내림차순)`,
  })
  @IsIn(['ASC', 'DESC'])
  @IsString()
  @IsNotEmpty()
  public order: 'ASC' | 'DESC';

  @ApiProperty({
    enum: ['active', 'archived'],
    description: `파티 상태
    active - 진행중
    archived - 종료
    `,
  })
  @IsString()
  @IsOptional()
  public status: string;

  @ApiProperty({
    enum: ['미정', '스터디', '포트폴리오', '해커톤', '공모전'],
    description: '파티 타입',
  })
  @IsString()
  @IsOptional()
  public partyType: string;

  @ApiProperty({
    example: '모동숲 파티',
    description: '검색 기능 (제목에 관하여)',
  })
  @IsString()
  @IsOptional()
  public titleSearch: string;
}
