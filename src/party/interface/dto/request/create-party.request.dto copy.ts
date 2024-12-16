import { ApiProperty } from '@nestjs/swagger';
import { File } from 'buffer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class testDto {
  @ApiProperty({
    example: 'image file (jpg, jpeg, png)',
    description: '업로드할 이미지 파일',
    required: false,
  })
  @IsOptional()
  readonly image: File; // 스웨거 문서용 표기

  @ApiProperty({
    example: 'test',
    description: '아무값 stringtest',
  })
  @IsString()
  @IsNotEmpty()
  readonly test: string;
}
