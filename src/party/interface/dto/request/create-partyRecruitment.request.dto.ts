import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { RecruitmentRequestDto } from './recruitment.request.dto';

export class CreatePartyRecruitmentRequestDto {
  @ApiProperty({
    description: '모집',
    type: [RecruitmentRequestDto],
  })
  @ValidateNested({ each: true })
  @Type(() => RecruitmentRequestDto)
  @ArrayUnique()
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  readonly recruitments: RecruitmentRequestDto[];
}
