import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GuildParamRequestDto {
  @ApiProperty({
    example: '1',
    description: '길드 고유 ID',
  })
  @IsInt()
  @IsNotEmpty()
  readonly guildId: number;
}
