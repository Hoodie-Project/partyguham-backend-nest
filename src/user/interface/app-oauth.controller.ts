import { CommandBus } from '@nestjs/cqrs';
import { Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { KakaoAppLoginCommand } from '../application/command/kakao-app-login.command';
import { GoogleAppLoginCommand } from '../application/command/google-app-login.command';

@ApiTags('app-oauth (앱 오픈 인증)')
@Controller('users')
export class AppOauthController {
  constructor(private commandBus: CommandBus) {}

  @Post('kakao/app/login')
  @ApiOperation({
    summary: 'App Kakao 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 완료',
    schema: { example: { accessToken: 'accessToken', refreshToken: 'refreshToken' } },
  })
  @ApiResponse({
    status: 401,
    description: '회원가입이 되어있지 않아 로그인 권한이 없음 - 회원가입으로 이동',
    schema: {
      example: { message: '로그인이 불가능 하여, 회원가입을 시도 해주세요', signupAccessToken: 'signupAccessToken' },
    },
  })
  async kakaoAppLogin(@Req() req: Request, @Res() res: Response, @Headers('authorization') authorization: string) {
    const kakaoAccessToken = authorization.split(' ')[1]; // "Bearer"를 제거하고 토큰만 가져옴

    const command = new KakaoAppLoginCommand(kakaoAccessToken);

    const result = await this.commandBus.execute(command);

    // 로그인
    if (result.type === 'login') {
      res.status(200).json({ refreshToken: result.refreshToken, accessToken: result.accessToken });
    }

    // 회원가입
    if (result.type === 'signup') {
      res.status(401).json({
        message: '로그인이 불가능 하여, 회원가입을 시도 해주세요',
        signupAccessToken: result.signupAccessToken,
      });
    }
  }

  @Post('google/app/login')
  @ApiOperation({
    summary: 'App Google 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 완료',
    schema: { example: { accessToken: 'accessToken', refreshToken: 'refreshToken' } },
  })
  @ApiResponse({
    status: 401,
    description: '회원가입이 되어있지 않아 로그인 권한이 없음 - 회원가입으로 이동',
    schema: {
      example: { message: '로그인이 불가능 하여, 회원가입을 시도 해주세요', signupAccessToken: 'signupAccessToken' },
    },
  })
  async googleAppLogin(@Req() req: Request, @Res() res: Response, @Headers('authorization') authorization: string) {
    const googleAccessToken = authorization.split(' ')[1]; // "Bearer"를 제거하고 토큰만 가져옴

    const command = new GoogleAppLoginCommand(googleAccessToken);

    const result = await this.commandBus.execute(command);

    // 로그인
    if (result.type === 'login') {
      res.status(200).json({ refreshToken: result.refreshToken, accessToken: result.accessToken });
    }

    // 회원가입
    if (result.type === 'signup') {
      res.status(401).json({
        message: '로그인이 불가능 하여, 회원가입을 시도 해주세요',
        signupAccessToken: result.signupAccessToken,
      });
    }
  }
}
