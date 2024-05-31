import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AppOauthRequestDto {
  @ApiProperty({
    example: 'exampleUID',
    description: '(카카오 / 구글) 고유 ID(User ID)',
  })
  @IsString()
  @IsNotEmpty()
  readonly uid: string;

  @ApiPropertyOptional({
    example: 'idToken',
    description: 'oauth를 제공하는 서버에서 인증을 확인을 위한 키',
  })
  @IsString()
  @IsOptional()
  readonly idToken: string;
}
