import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AppGoogleLoginRequestDto {
  @ApiProperty({
    example: 'ey...',
    description: '구글 id token',
  })
  @IsString()
  @IsNotEmpty()
  readonly idToken: string;
}
