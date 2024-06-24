import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

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
}
