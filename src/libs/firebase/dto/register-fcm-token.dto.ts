import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class RegisterFcmTokenDto {
  @ApiProperty({
    example: 'FCM TOKEN',
    description: '업로드할 유저(디바이스) 토큰',
  })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;

  @ApiProperty({
    example: 'android, ios, chrome',
    enum: ['android', 'ios', 'chrome'],
    description: '토큰 주체',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['android', 'ios', 'chrome'])
  device: string;
}
