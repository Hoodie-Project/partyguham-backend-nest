import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class personalityOptionResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Exclude()
  @ApiProperty({ example: 1 })
  personalityQuestionId: number;

  @Expose()
  @ApiProperty({
    example: '오전',
  })
  content: string;
}

@Exclude()
export class personalityQuestionResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: '집중이 잘 되는 시간은 언제인가요?' })
  content: string;

  @Expose()
  @ApiProperty({
    example: '1',
  })
  responseCount: string;

  @Expose()
  @ApiProperty({ type: () => [personalityOptionResponseDto] })
  personalityOption: personalityOptionResponseDto[];
}
