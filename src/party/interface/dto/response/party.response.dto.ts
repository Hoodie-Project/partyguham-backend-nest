import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class PartyResponseDto {
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
  @IsNotEmpty()
  @IsString()
  readonly content: string;
}

export class PartiesResponseDto {
  @ApiProperty()
  data: PartyResponseDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.

  @ApiProperty()
  count: number;
}
