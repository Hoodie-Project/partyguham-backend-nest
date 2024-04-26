import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsISO8601, IsIn, IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class UidRequestDto {
  @ApiProperty({
    example: 'asmekjfi9j2',
    description: '(카카오 / 구글) UID',
  })
  @IsString()
  @IsNotEmpty()
  readonly uid: string;
}
