import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterFcmTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['android', 'ios', 'chrome'])
  device: string; // 예: 'android', 'ios', 'chrome'
}
