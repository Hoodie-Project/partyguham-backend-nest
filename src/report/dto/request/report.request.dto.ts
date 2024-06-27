import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReportRequestDto {
  @ApiProperty({
    example: 'party',
    description: '신고 대상',
  })
  @IsIn(['party', 'user'])
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty({
    example: 123,
    description: '신고하고자 하는 고유 아이디 (PK)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly typeId: number;

  @ApiProperty({
    example: '부적절한 게시물 입니다.',
    description: '신고 내용',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
