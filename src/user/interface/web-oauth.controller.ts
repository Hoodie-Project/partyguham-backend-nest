import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiCookieAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessJwtAuthGuard, SignupJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { KakaoCodeCommand } from '../application/command/kakao-code.command';
import { KakaoLoginCommand } from '../application/command/kakao-login.command';
import { GoogleCodeCommand } from '../application/command/google-code.command';
import { GoogleLoginCommand } from '../application/command/google-login.command';

@ApiTags('web-oauth (웹 오픈 인증)')
@Controller('users')
export class WebOauthController {
  constructor(private commandBus: CommandBus) {}

  @Get('kakao/login')
  @ApiOperation({ summary: '카카오 로그인 (응답은 /kakao/callback API 확인)' })
  async signinByKakao(@Res() res: Response) {
    const command = new KakaoCodeCommand();

    const result = await this.commandBus.execute(command);

    res.redirect(result);
  }

  @Get('kakao/callback')
  @ApiOperation({
    summary: ' 로그인 시도에 대한 카카오 서버에 대한 응답 (/kakao/login 리다이렉트 API)',
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
  })
  async kakaoCallback(@Req() req: Request, @Res() res: Response, @Query('code') code: string) {
    const command = new KakaoLoginCommand(code);

    let result:
      | { type: 'signup'; signupAccessToken: string; email: string }
      | { type: 'login'; accessToken: string; refreshToken: string };

    result = await this.commandBus.execute(command);

    if (result.type === 'login') {
      res.cookie('refreshToken', result.refreshToken, {
        secure: true, // HTTPS 연결에서만 쿠키 전송
        httpOnly: true, // JavaScript에서 쿠키 접근 불가능
        sameSite: process.env.MODE_ENV === 'prod' ? 'strict' : 'none', // CSRF 공격 방지
        domain: process.env.MODE_ENV === 'prod' ? 'partyguam.net' : 'localhost',
      });

      res.redirect(`${process.env.BASE_URL}`);
    }

    if (result.type === 'signup') {
      req.session.email = result.email;
      // req.session.image = result.image;

      res.cookie('signupToken', result.signupAccessToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.MODE_ENV === 'prod' ? 'strict' : 'none',
        expires: new Date(Date.now() + 3600000), // 현재 시간 + 1시간
      });

      res.redirect(`${process.env.BASE_URL}/join`);
    }
  }

  @Get('google/login')
  @ApiOperation({ summary: '구글 로그인 (응답은 /google/callback API 확인)' })
  async signinByGoogle(@Res() res: Response) {
    const command = new GoogleCodeCommand();

    const result = await this.commandBus.execute(command);

    res.redirect(result);
  }

  @Get('google/callback')
  @ApiOperation({
    summary: '사용 X // 로그인 시도에 대한 구글 서버에 대한 응답 (/google/login 리다이렉트 API)',
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
  })
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Query('scope') scope: string,
  ) {
    const command = new GoogleLoginCommand(code);

    let result:
      | { type: 'signup'; signupAccessToken: string; email: string }
      | { type: 'login'; accessToken: string; refreshToken: string };

    result = await this.commandBus.execute(command);

    if (result.type === 'login') {
      res.cookie('refreshToken', result.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.MODE_ENV === 'prod' ? 'strict' : 'none',
        domain: process.env.MODE_ENV === 'prod' ? 'partyguam.net' : 'localhost',
      });

      res.redirect(`${process.env.BASE_URL}`);
    }

    if (result.type === 'signup') {
      req.session.email = result.email;
      // req.session.image = result.image;

      res.cookie('signupToken', result.signupAccessToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.MODE_ENV === 'prod' ? 'strict' : 'none',
        expires: new Date(Date.now() + 3600000), // 현재 시간 + 1시간
      });

      res.redirect(`${process.env.BASE_URL}/join`);
    }
  }

  @ApiHeader({ name: 'cookies', description: 'signupToken' })
  @UseGuards(SignupJwtAuthGuard)
  @Get('me/oauth')
  @ApiOperation({ summary: 'session에서 oauth 본인 데이터 호출 (email, image)' })
  @ApiResponse({
    status: 200,
    description: '이메일, oauth 이미지 URL 데이터',
    schema: { example: { email: 'email@partyguam.net', image: 'image URL' } },
  })
  async getData(@Req() req: Request) {
    const email = req.session.email || null;
    const image = req.session.image || null;

    return { email, image };
  }
}
