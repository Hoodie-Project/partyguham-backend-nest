import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsISO8601, IsIn, IsOptional, IsString, Length } from 'class-validator';

export class UapdateUserRequestDto {
  @ApiProperty({
    description: 'M: 남성, F: 여성',
    example: 'M',
  })
  @Length(1, 1)
  @IsIn(['M', 'F'])
  @IsString()
  @IsOptional()
  public gender: string;

  @ApiProperty({
    description: '성별 공개 여부 : true / false',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  public genderVisible: boolean;

  @ApiProperty({
    description: '생년월일',
    example: '2024-01-01',
  })
  @Length(10)
  @IsISO8601()
  @IsOptional()
  public birth: string;

  @ApiProperty({
    description: '생년월일 공개 여부',
    example: '성별 공개 여부 : true / false',
  })
  @Length(10)
  @IsBoolean()
  @IsOptional()
  public birthVisible: boolean;

  @ApiProperty({
    description: '포트폴리오 링크',
    example: 'https://example.com/..',
  })
  @IsString()
  @IsOptional()
  public portfolio: string;
}
