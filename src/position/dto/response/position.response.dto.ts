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

@Exclude()
export class PositionsResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
  })
  count: number;

  @Expose()
  @ApiProperty({ type: [PositionResponseDto] })
  data: PositionResponseDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.
}
