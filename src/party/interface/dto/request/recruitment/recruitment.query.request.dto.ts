import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class RecruitmentsQueryRequestDto {
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

  @ApiPropertyOptional({
    enum: ['기획자', '디자이너', '개발자', '마케터/광고'], // 허용되는 값 목록
    description:
      '직군 조건 조회 (선택 옵션). 하나의 쿼리 파라미터로 여러 개의 값을 전달할 수 있습니다 (예: main=기획자&main=디자이너).',
    example: 'main=기획자&main=디자이너', // 예시
    type: String, // 단일 문자열로 지정
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(['기획자', '디자이너', '개발자', '마케터/광고'], { each: true }) // 각 요소가 유효한 값인지 검사
  @ArrayNotEmpty() // 배열이 비어있지 않아야 함
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), { toClassOnly: true })
  main?: string[];

  @ApiPropertyOptional({
    description:
      'position ID (PK - 포지션) 하나의 쿼리 파라미터로 여러 개의 값을 전달할 수 있습니다 (예: position=1&position=2).',
    example: '1',
  })
  @IsOptional()
  @IsArray() // 배열인지 확인
  @ArrayMaxSize(5) // 최대 5개의 숫자값을 받을 수 있도록 제한
  @IsNumberString({}, { each: true }) // 각 배열의 값이 숫자 문자열인지 확인
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), { toClassOnly: true })
  public position: number[];

  @ApiPropertyOptional({
    example: 1,
    description: 'party type ID (PK - 파티 타입)',
  })
  @IsNumber()
  @IsOptional()
  readonly partyType: number;

  @ApiPropertyOptional({
    example: '모동숲 파티',
    description: '검색 기능 (제목에 관하여)',
  })
  @IsOptional()
  @IsString()
  public titleSearch: string;
}
