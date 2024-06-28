import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdatePartyRequestDto {
  @ApiProperty({
    example: 'image file (jpg, jpeg, png)',
    description: '업로드할 이미지 파일',
    required: false,
  })
  @IsOptional()
  readonly image: File; // 스웨거 문서용 표기

  @ApiProperty({
    example: 1,
    description: 'party type ID (PK - 파티 타입)',
  })
  @IsInt()
  @IsOptional()
  readonly partyTypeId: number;

  @ApiProperty({
    example: '파티구함',
    description: '제목',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly title: string;

  @ApiProperty({
    example: '풀스텍 구함',
    description: '본문',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly content: string;
}
