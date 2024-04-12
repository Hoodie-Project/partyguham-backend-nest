import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsNotEmpty } from 'class-validator';
import { PersonalityDto } from '../personality.dto';

export class UserPersonalityCreateRequestDto {
  @ApiProperty({
    description: '성향 저장',
    type: [PersonalityDto],
  })
  @Type(() => PersonalityDto)
  @ArrayUnique()
  @IsArray()
  @IsNotEmpty()
  readonly personality: PersonalityDto[];
}
