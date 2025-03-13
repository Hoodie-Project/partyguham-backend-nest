import { Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { NotificationService } from './notification.service';
import { NotificationPaginationQueryDto } from './dto/notification-pagination-query.dto';
import { NotificationPaginationResponseDto } from './dto/notification-pagination-response.dto';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';

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
    const { limit, cursor } = query;
    const result = await this.notificationService.getNotifications(user.id, limit, cursor);

    return plainToInstance(NotificationPaginationResponseDto, result);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Patch(':id/read')
  @ApiOperation({ summary: '알람 읽음 처리' })
  @ApiResponse({
    status: 200,
    description: '알람 읽음 처리',
  })
  async getLocations(@Query() query) {}
}
