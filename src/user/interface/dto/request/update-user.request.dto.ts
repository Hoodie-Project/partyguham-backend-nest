import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { MeetingTimeType, MeetingType, MeetingWeekType } from 'src/user/infra/db/entity/user.entity';

export class UpdateUserRequestDto {
  @ApiPropertyOptional({
    example: true,
    description: '모임참석여부',
  })
  @IsBoolean()
  @IsOptional()
  readonly isParty: boolean;

  @ApiPropertyOptional({
    example: MeetingType.OFFLINE,
    description: '모임참석형태',
    enum: MeetingType,
  })
  @IsString()
  @IsOptional()
  readonly meetingType: string;

  @ApiPropertyOptional({
    example: MeetingWeekType.WEEKDAY,
    description: '모임참석 주중, 주말',
    enum: MeetingWeekType,
  })
  @IsString()
  @IsOptional()
  readonly meetingWeek: string;

  @ApiPropertyOptional({
    example: MeetingTimeType.AM,
    description: '모임참석 시간',
    enum: MeetingTimeType,
  })
  @IsString()
  @IsOptional()
  readonly meetingTime: string;

  @ApiPropertyOptional({
    example: 'intp',
    description: 'mbti',
    enum: [
      'entp',
      'enfp',
      'entj',
      'enfj',
      'estp',
      'esfp',
      'estj',
      'esfj',
      'intp',
      'infp',
      'intj',
      'infj',
      'istp',
      'isfp',
      'istj',
      'isfj',
    ],
  })
  @IsString()
  @IsOptional()
  readonly mbti: string;

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'skill id(pk)',
  })
  @IsInt()
  @IsOptional()
  readonly skillIds: number[];

  @ApiPropertyOptional({
    example: 1,
    description: 'position id(pk)',
  })
  @IsInt()
  @IsOptional()
  readonly positionId: number[];
}
