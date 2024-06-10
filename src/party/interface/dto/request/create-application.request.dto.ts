import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePartyApplicationRequestDto {
  @ApiProperty({
    example: '해당 파티에 지원하고 싶습니다.',
    description: '모집공고에서 지원시 입력할 메세지',
  })
  @IsString()
  @IsNotEmpty()
  readonly message: string;
}
