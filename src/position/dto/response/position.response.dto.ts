import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PositionResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: '기획' })
  main: string;

  @Expose()
  @ApiProperty({
    example: 'UI/UX 기획자',
  })
  sub: string;
}
