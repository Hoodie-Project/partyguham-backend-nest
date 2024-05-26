import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePartyRecruitmentRequestDto {
  @ApiProperty({
    example: '1',
    description: '포지션 PK id',
  })
  @IsString()
  @IsNotEmpty()
  readonly positionId: string;

  @ApiProperty({
    example: '3',
    description: '해당 포지션의 모집 인원',
  })
  @IsString()
  @IsNotEmpty()
  readonly capacity: string;
}
