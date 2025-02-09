import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @ApiPropertyOptional({
    enum: ['active', 'archived'],
    description: `파티 상태
    active - 진행중
    archived - 종료
    `,
  })
  @IsIn(['active', 'archived'])
  @IsString()
  @IsOptional()
  public status: string;

  @ApiPropertyOptional({
    example: 1,
    description:
      'party type ID (PK - 파티 타입) 하나의 쿼리 파라미터로 여러 개의 값을 전달할 수 있습니다 (예: partyType=1&partyType=2)',
  })
  @IsArray()
  @IsNumber({}, { each: true }) // 배열 내 각 항목이 숫자인지 확인
  @IsOptional() // 선택적으로 받을 경우 추가
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)])) // 단일 값도 배열로 변환
  readonly partyType: number[];

  @ApiPropertyOptional({
    example: '모동숲 파티',
    description: '검색 기능 (제목에 관하여)',
  })
  @IsString()
  @IsOptional()
  public titleSearch: string;
}
