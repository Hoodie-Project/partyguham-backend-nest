import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from 'src/common/entity/baseEntity';

export class UpdatePartyRequestDto {
  @ApiPropertyOptional({
    example: 'image file (jpg, jpeg, png)',
    description: '업로드할 이미지 파일',
    required: false,
  })
  @IsOptional()
  readonly image: File; // 스웨거 문서용 표기

  @ApiPropertyOptional({
    example: 1,
    description: 'party type ID (PK - 파티 타입)',
  })
  @IsInt()
  @IsOptional()
  readonly partyTypeId: number;

  @ApiPropertyOptional({
    example: '파티구함',
    description: '제목',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly title: string;

  @ApiPropertyOptional({
    example: '풀스텍 구함',
    description: '본문',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly content: string;

  @ApiPropertyOptional({
    enum: ['active', 'archived'],
    description: `파티 상태
    active - 진행중
    archived - 종료
    `,
  })
  @IsIn(['active', 'archived'])
  @IsString()
  @IsOptional()
  public status: StatusEnum;
}
