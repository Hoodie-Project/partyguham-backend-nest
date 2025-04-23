import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class FcmTestDto {
  @ApiProperty({
    example: 'FCM TOKEN',
    description: '업로드할 유저(디바이스) 토큰',
  })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;

  @ApiProperty({
    example: '제목',
    description: '푸시 알람 제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'message(body)',
    description: '푸시 알람 내용',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
