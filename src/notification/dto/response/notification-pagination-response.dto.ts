import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
class NotificationTypeDto {
  @Expose()
  @ApiProperty({
    example: 'party',
    description: 'notification type',
  })
  type: string;

  @Expose()
  @ApiProperty({
    example: '파티활동',
  })
  label: string;
}

@Exclude()
class NotificationResponseDto {
  @Expose()
  @ApiProperty({
    example: 50,
    description: '알림 ID',
  })
  id: number;

  @Expose()
  @ApiProperty({
    type: NotificationTypeDto,
    description: '알림 ID',
  })
  @Type(() => NotificationTypeDto)
  notificationType: NotificationTypeDto;

  @Expose()
  @ApiProperty({
    example: '파티명',
    description: '파티 제목',
  })
  title: string;

  @Expose()
  @ApiProperty({
    example: '새 알림',
    description: '알림 내용',
  })
  message: string;

  @Expose()
  @ApiProperty({
    example: 'image url',
    nullable: true,
  })
  image: string;

  @Expose()
  @ApiProperty({
    example: '/party/321#home',
    description: '알림 내용',
  })
  link: string;

  @Expose()
  @ApiProperty({
    example: false,
    description: '알림 읽음 여부 (링크 접속)',
  })
  isRead: boolean;

  @Expose()
  @ApiProperty({
    example: false,
    description: '알림 체크 여부 (알람 버튼 확인)',
  })
  isChecked: boolean;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '합류일',
  })
  @IsString()
  readonly createdAt: string;
}

export class NotificationPaginationResponseDto {
  @ApiProperty({
    type: [NotificationResponseDto],
    description: '알림 목록',
    minItems: 0,
  })
  @Type(() => NotificationResponseDto)
  notifications: NotificationResponseDto[];

  @ApiProperty({
    example: 50,
    description: '다음 페이지 조회를 위한 cursor ID',
    nullable: true,
  })
  nextCursor: number;
}
