import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class NotificationReadQueryDto {
  @ApiProperty({
    example: 50,
    description: 'notification Id (PK - 알람)',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  public notificationId: number;
}
