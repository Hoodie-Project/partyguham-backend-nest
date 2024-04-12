import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsNotEmpty } from 'class-validator';
import { PersonalityDto } from '../personality.dto';

export class UserPersonalityCreateRequestDto {
  @ApiProperty({
    example: [{ personalityQuestionId: 1, personalityOptionId: [1, 2] }],
    description: '성향 저장',
  })
  @Type(() => PersonalityDto)
  @ArrayUnique()
  @IsArray()
  @IsNotEmpty()
  readonly personality: PersonalityDto[];
}
