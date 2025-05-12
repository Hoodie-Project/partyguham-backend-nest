import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AppOpenNotificationDto {
  @ApiProperty({
    example: 'partyguham@gmail.com',
    description: '알람 받을 이메일',
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}
