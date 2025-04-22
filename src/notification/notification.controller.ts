import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { plainToInstance } from 'class-transformer';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { FirebaseService } from 'src/libs/firebase/firebase.service';
import { NotificationService } from './notification.service';

import { NotificationPaginationQueryDto } from './dto/request/notification-pagination-query.dto';
import { NotificationPaginationResponseDto } from './dto/response/notification-pagination-response.dto';
import { NotificationReadQueryDto } from './dto/request/notification-read-query.dto';

@ApiTags('notification - 알람')
@Controller('notifications')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private firebaseService: FirebaseService,
  ) {}

  @Post('test')
  @ApiOperation({ summary: '테스트 푸시 알림 보내기' })
  async test(@Body() body: { token: string; title: string; message: string }) {
    const { token, title, message } = body;
    return await this.firebaseService.sendDataPushNotification(token, title, message);
  }

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
}
