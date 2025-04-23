import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';

import { Request } from 'express';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FcmService } from './fcm.service';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';
import { FcmTestDto } from './dto/fcm-test.dto';

@ApiTags('Firebase Cloud Messaging')
@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  /**
   * @description FCM Test
   */
  @Post('test')
  @ApiOperation({ summary: '테스트 푸시 알림 보내기' })
  async test(@Body() body: FcmTestDto) {
    const { fcmToken, title, message } = body;
    return await this.fcmService.sendDataPushNotification(fcmToken, title, message, 'test');
  }

  /**
   * @description 로그인한 유저의 FCM 토큰을 저장
   */
  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Post('register-token')
  @ApiHeader({
    name: 'Authorization',
    description: `Bearer {access token}`,
    required: true,
  })
  @ApiOperation({ summary: '토큰 등록하기' })
  async registerToken(@CurrentUser() user: CurrentUserType, @Body() body: RegisterFcmTokenDto) {
    const userId = user.id;
    return this.fcmService.registerFcmToken(userId, body.fcmToken, body.device);
  }
}
