import { ApiProperty } from '@nestjs/swagger';
import { File } from 'buffer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBannerRequestDto {
  @ApiProperty({
    example: 'image file (jpg, jpeg, png)',
    description: '업로드할 이미지 파일',
    required: false,
  })
  @IsOptional()
  readonly image: File; // 스웨거 문서용 표기

  @ApiProperty({
    example: '비밀번호',
    description: '이미지 업로드 권한 (임시)',
  })
  @IsOptional()
  readonly password: string;

  @ApiProperty({
    example: '파티구함',
    description: '제목',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: 'https://partyguham.com',
    description: '이미지와 연결되는 이미지 링크',
  })
  @IsString()
  @IsNotEmpty()
  readonly link: string;
}
