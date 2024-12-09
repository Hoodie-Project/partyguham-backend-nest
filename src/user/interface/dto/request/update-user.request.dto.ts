import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
    example: 'false',
  })
  @Transform((value) => {
    const genderVisible = value.obj.genderVisible;
    if (genderVisible === 'true' || genderVisible === true) return true;
    if (genderVisible === 'false' || genderVisible === false) return false;
    throw new BadRequestException('genderVisible must be a boolean');
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
    description: '성별 공개 여부 : true / false',
    example: 'true',
  })
  @Transform((value) => {
    const birthVisible = value.obj.birthVisible;
    if (birthVisible === 'true' || birthVisible === true) return true;
    if (birthVisible === 'false' || birthVisible === false) return false;
    throw new BadRequestException('birthVisible must be a boolean');
  })
  @IsBoolean()
  @IsOptional()
  birthVisible: boolean;

  @ApiProperty({
    description: '포트폴리오 제목',
    example: '포트폴리오 제목',
  })
  @IsString()
  @IsOptional()
  public portfolioTitle: string;

  @ApiProperty({
    description: '포트폴리오 링크',
    example: 'https://example.com/..',
  })
  @IsString()
  @IsOptional()
  public portfolio: string;
}
