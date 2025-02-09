import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReportResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
    description: '신고한 고유 아이디 (PK)',
  })
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: 'party',
    description: '신고 대상',
  })
  readonly type: string;

  @Expose()
  @ApiProperty({
    example: 123,
    description: '신고하고자 하는 고유 아이디 (PK)',
  })
  readonly typeId: number;

  @Expose()
  @ApiProperty({
    example: '부적절한 게시물 입니다.',
    description: '신고 내용',
  })
  readonly content: string;
}
