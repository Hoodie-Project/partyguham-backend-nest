import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DeleteBannerRequestDto {
  @ApiProperty({
    example: '비밀번호',
    description: '이미지 업로드 권한 (임시)',
  })
  @IsOptional()
  readonly password: string;

  @ApiProperty({
    example: 1,
    description: 'banner ID (PK - 배너)',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly bannerId: number;
}
