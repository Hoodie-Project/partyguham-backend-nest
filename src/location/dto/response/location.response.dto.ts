import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class locationResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: '서울특별시' })
  province: string;

  @Expose()
  @ApiProperty({
    example: '강남구',
  })
  city: string;
}

@Exclude()
export class locationsResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
  })
  count: number;

  @Expose()
  @ApiProperty({ type: [locationResponseDto] })
  data: locationResponseDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.
}
