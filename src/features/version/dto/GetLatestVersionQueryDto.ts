import { IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetLatestVersionQueryDto {
  @ApiProperty({ example: 'android', enum: ['android', 'ios'], description: '플랫폼' })
  @IsString()
  @IsIn(['android', 'ios'], { message: 'platform must be either "android" or "ios"' })
  platform: string;
}
