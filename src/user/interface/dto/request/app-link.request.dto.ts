import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AppLinkRequestDto {
  @ApiProperty({
    example: 'oauth access token',
    description: '해당 플랫폼의 access token 대입',
  })
  @IsString()
  @IsNotEmpty()
  readonly oauthAccessToken: string;
}
