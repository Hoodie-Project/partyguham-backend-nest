import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { plainToInstance } from 'class-transformer';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { NotificationService } from './notification.service';

import { NotificationPaginationQueryDto } from './dto/request/notification-pagination-query.dto';
import { NotificationPaginationResponseDto } from './dto/response/notification-pagination-response.dto';
import { NotificationReadQueryDto } from './dto/request/notification-read-query.dto';

@ApiTags('notification - 알람')
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Get('')
  @ApiOperation({ summary: '알람 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: `알람 리스트 조회  
  
- 알림 도착  (안읽은 상태, 뱃지 표시됨)   
isChecked =  false / isRead = false  
- 알림 리스트 열었음  (읽지는 않음, 뱃지는 사라지지만, 읽지 않은 알림 표시 유지)  
isChecke =  true  /   isRead = false
- 알림 클릭하여 상세 확인  (읽음 처리 완료)          
isChecked = true / isRead = true   
    `,
    type: NotificationPaginationResponseDto,
  })
  async getNotification(@CurrentUser() user: CurrentUserType, @Query() query: NotificationPaginationQueryDto) {
    const { limit, cursor, type } = query;
    const result = await this.notificationService.getNotifications(user.id, limit, cursor, type);

    return plainToInstance(NotificationPaginationResponseDto, result);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Patch('check')
  @ApiOperation({ summary: '알람 체크 처리' })
  @ApiResponse({
    status: 200,
    description: '알람 체크 처리',
    schema: { example: { message: '모든 알림이 체크 처리되었습니다.' } },
  })
  async checkNotification(@CurrentUser() user: CurrentUserType) {
    await this.notificationService.markAsCheck(user.id);

    return { message: '모든 알림이 체크 처리되었습니다.' };
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Patch(':notificationId/read')
  @ApiOperation({ summary: '알람 읽음 처리' })
  @ApiResponse({
    status: 200,
    description: '알람 읽음 처리',
    schema: { example: { message: '알림이 읽음 처리되었습니다.' } },
  })
  async readNotification(@CurrentUser() user: CurrentUserType, @Param() param: NotificationReadQueryDto) {
    const { notificationId } = param;
    await this.notificationService.markAsRead(user.id, notificationId);

    return { message: '알림이 읽음 처리되었습니다.' };
  }

  @ApiBearerAuth('AccessJwt')
  @HttpCode(204)
  @UseGuards(AccessJwtAuthGuard)
  @Delete(':notificationId')
  @ApiOperation({ summary: '삭제 처리' })
  @ApiResponse({
    status: 204,
    description: '알림 삭제 성공',
  })
  async deleteNotification(@CurrentUser() user: CurrentUserType, @Param() param: NotificationReadQueryDto) {
    const { notificationId } = param;
    await this.notificationService.deleteNotification(user.id, notificationId);
  }
}
