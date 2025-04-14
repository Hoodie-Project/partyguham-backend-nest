import { Controller, Delete, Get, HttpCode, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { NotificationService } from './notification.service';
import { NotificationPaginationQueryDto } from './dto/request/notification-pagination-query.dto';
import { NotificationPaginationResponseDto } from './dto/response/notification-pagination-response.dto';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
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
    description: '알람 리스트 조회',
    type: NotificationPaginationResponseDto,
  })
  async getNotification(@CurrentUser() user: CurrentUserType, @Query() query: NotificationPaginationQueryDto) {
    const { limit, cursor, type } = query;
    const result = await this.notificationService.getNotifications(user.id, limit, cursor, type);

    return plainToInstance(NotificationPaginationResponseDto, result);
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
  ç;
}
