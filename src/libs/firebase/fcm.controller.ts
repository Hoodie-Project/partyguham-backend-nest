import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';

import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FcmService } from './fcm.service';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';

@ApiTags('Firebase Cloud Messaging')
@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  /**
   * @description FCM Test
   */
  @Post('test')
  @ApiOperation({ summary: '테스트 푸시 알림 보내기' })
  async test(@Body() body: { token: string; title: string; message: string }) {
    const { token, title, message } = body;
    return await this.fcmService.sendDataPushNotification(token, title, message, 'test');
  }

  /**
   * @description 로그인한 유저의 FCM 토큰을 저장
   */
  @UseGuards(AccessJwtAuthGuard)
  @Post('register-token')
  @ApiOperation({ summary: '테스트 푸시 알림 보내기' })
  async registerToken(@CurrentUser() user: CurrentUserType, @Req() req: Request, @Body() body: RegisterFcmTokenDto) {
    const userId = user.id;
    return this.fcmService.registerFcmToken(userId, body.token, body.device);
  }
}
