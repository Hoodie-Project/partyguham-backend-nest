import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PartyCommentRequestDto {
  @ApiProperty({
    example: '지원하고 싶습니다.',
    description: '댓글 내용',
  })
  @IsString()
  @IsNotEmpty()
  readonly comment: string;
}
