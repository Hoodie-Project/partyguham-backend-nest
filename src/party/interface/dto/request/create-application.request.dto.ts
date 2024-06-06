import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePartyApplicationRequestDto {
  @ApiProperty({
    example: '파티에 지원하고 싶습니다.',
    description: '지원사유',
  })
  @IsString()
  @IsNotEmpty()
  readonly message: string;
}
