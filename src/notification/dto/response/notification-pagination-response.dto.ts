import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Exclude()
class NotificationResponseDto {
  @ApiProperty({
    example: 50,
    description: '알림 ID',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: '사용자 ID',
  })
  userId: number;

  @ApiProperty({
    example: '새 알림',
    description: '알림 내용',
  })
  content: string;

  @ApiProperty({
    example: false,
    description: '알림 읽음 여부',
  })
  isRead: boolean;
}

export class NotificationPaginationResponseDto {
  @ApiProperty({
    type: [NotificationResponseDto],
    description: '알림 목록',
  })
  notifications: NotificationResponseDto[];

  @ApiProperty({
    example: 50,
    description: '다음 페이지 조회를 위한 cursor ID',
  })
  nextCursor: number;
}
