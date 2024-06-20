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
