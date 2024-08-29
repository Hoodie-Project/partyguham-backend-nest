import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiCookieAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppOauthRequestDto } from './dto/request/app-oauth.request.dto';

import { KakaoAppLoginCommand } from '../application/command/kakao-app-login.command';
import { GoogleAppLoginCommand } from '../application/command/google-app-login.command';

@ApiTags('app-oauth')
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
    headers: {
      'Set-Cookie': {
        description: 'Cookie header',
        schema: {
          type: 'string',
          example: 'refreshToken=abc123; Path=/; HttpOnly; Secure; SameSite=Strict',
        },
      },
    },
    schema: { example: { accessToken: 'token' } },
  })
  @ApiResponse({
    status: 401,
    description: '회원가입이 되어있지 않아 로그인 권한이 없음 / 회원가입 진행',
    headers: {
      'Set-Cookie': {
        description: 'Cookie header',
        schema: {
          type: 'string',
          example: 'signupToken=abc123; Path=/; HttpOnly; Secure; SameSite=Strict',
        },
      },
    },
    schema: { example: { message: '로그인이 불가능 하여, 회원가입을 시도 해주세요' } },
  })
  async kakaoAppLogin(@Req() req: Request, @Res() res: Response, @Body() dto: AppOauthRequestDto) {
    const command = new KakaoAppLoginCommand(dto.uid);

    const result = await this.commandBus.execute(command);
    if (result.type === 'login') {
      res.cookie('refreshToken', result.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
      });

      res.status(200).json({ accessToken: result.accessToken });
    }

    if (result.type === 'signup') {
      res.cookie('signupToken', result.signupAccessToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
        expires: new Date(Date.now() + 3600000),
      });

      res.status(401).json({ message: '로그인이 불가능 하여, 회원가입을 시도 해주세요' });
    }
  }

  @Post('google/app/login')
  @ApiOperation({
    summary: 'App Google 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 가능',
    headers: {
      'Set-Cookie': {
        description: 'Cookie header',
        schema: {
          type: 'string',
          example: 'refreshToken=abc123; Path=/; HttpOnly; Secure; SameSite=Strict',
        },
      },
    },
    schema: { example: { accessToken: 'token' } },
  })
  @ApiResponse({
    status: 401,
    description: '회원가입이 되어있지 않아 로그인 권한이 없음 / 회원가입 진행 ',
    headers: {
      'Set-Cookie': {
        description: 'Cookie header',
        schema: {
          type: 'string',
          example: 'signupToken=abc123; Path=/; HttpOnly; Secure; SameSite=Strict',
        },
      },
    },
    schema: { example: { message: '로그인이 불가능 하여, 회원가입을 시도 해주세요.' } },
  })
  async googleAppLogin(@Req() req: Request, @Res() res: Response, @Body() dto: AppOauthRequestDto) {
    const command = new GoogleAppLoginCommand(dto.uid);

    const result = await this.commandBus.execute(command);

    if (result.type === 'login') {
      res.cookie('refreshToken', result.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
      });
      res.status(200).json({ accessToken: result.accessToken });
    }

    if (result.type === 'signup') {
      res.cookie('signupToken', result.signupAccessToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
        expires: new Date(Date.now() + 3600000), // 현재 시간 + 1시간
      });

      res.status(401).json({ message: '로그인이 불가능 하여, 회원가입을 시도 해주세요' });
    }
  }
}
