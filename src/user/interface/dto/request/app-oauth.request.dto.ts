import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AppOauthRequestDto {
  @ApiProperty({
    example: 'asmekjfi9j2',
    description: '(카카오 / 구글) UID',
  })
  @IsString()
  @IsNotEmpty()
  readonly uid: string;

  @ApiPropertyOptional({
    example: 'oauth를 제공하는 서버에서 인증을 확인을 위한 키',
    description: '(카카오 / 구글) UID',
  })
  @IsString()
  @IsOptional()
  readonly idToken: string;
}
