import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class PartyResponseDto {
  @Expose()
  @ApiProperty({
    example: '1',
    description: 'Party ID (파티 고유 번호)',
  })
  @IsString()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: '2',
    description: 'Party Type ID (파티타입 고유 번호)',
  })
  @IsString()
  @IsNotEmpty()
  readonly partyTypeId: number;

  @Expose()
  @ApiProperty({
    example: '파티구함',
    description: '제목',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @Expose()
  @ApiProperty({
    example: '풀스텍 구함',
    description: '본문',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @Expose()
  @ApiProperty({
    example: '/uploads/...',
    description: '이미지 서버 경로',
  })
  @IsString()
  @IsNotEmpty()
  readonly image: string;

  @Expose()
  @ApiProperty({
    example: 'active',
    description: '파티상태',
  })
  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '생성일자',
  })
  @IsString()
  @IsNotEmpty()
  readonly createdAt: string;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '수정일자',
  })
  @IsString()
  @IsNotEmpty()
  readonly updatedAt: string;
}
