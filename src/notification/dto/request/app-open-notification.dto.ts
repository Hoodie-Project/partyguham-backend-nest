import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AppOpenNotificationDto {
  @ApiProperty({
    example: 50,
    description: 'notification Id (PK - 알람)',
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}
