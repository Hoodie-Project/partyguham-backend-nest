import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CommentRequestDto {
  @ApiProperty({
    example: '파티 댓글 고유 ID',
    description: '파티 댓글 고유ID',
  })
  @IsInt()
  @IsNotEmpty()
  readonly commentId: number;
}
