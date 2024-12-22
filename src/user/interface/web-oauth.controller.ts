import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiCookieAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessJwtAuthGuard, SignupJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { KakaoCodeCommand } from '../application/command/kakao-code.command';
import { KakaoLoginCommand } from '../application/command/kakao-login.command';
import { GoogleCodeCommand } from '../application/command/google-code.command';
import { GoogleLoginCommand } from '../application/command/google-login.command';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { LinkOauthCommand } from '../application/command/link-oauth.command';
import { KakaoLinkCodeCommand } from '../application/command/kakaoLink-code.command';
import { KakaoLinkLoginCommand } from '../application/command/kakaoLink-login.command';
import { GoogleLinkLoginCommand } from '../application/command/googleLink-login.command';
import { GoogleLinkCodeCommand } from '../application/command/googleLink-code.command';

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
      });

      let redirectURL = process.env.BASE_URL;
      if (process.env.MODE_ENV === 'dev') {
        redirectURL = redirectURL + `?token=` + result.refreshToken;
      }

      res.redirect(`${redirectURL}`);
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

  @Get('kakao/link')
  @ApiOperation({ summary: '카카오 연동 (응답은 /kakao/link/callback API 확인)' })
  async linkByKakao(@Res() res: Response) {
    const command = new KakaoLinkCodeCommand();

    const result = await this.commandBus.execute(command);

    res.redirect(result);
  }

  @Get('kakao/link/callback')
  @ApiOperation({
    summary: '연동 시도에 대한 카카오 서버에 대한 응답 (/kakao/link 리다이렉트 API)',
    description: `존재하는 계정 - refreshToken, 연동 가능 계정 - linkToken`,
  })
  @ApiResponse({
    status: 200,
    description: '로그인되어 홈으로 리다이렉트',
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
    status: 201,
    description: '회원가입이 되어있지 않아 연동가능, linkToken 발급',
    headers: {
      'Set-Cookie': {
        description: 'Cookie header',
        schema: {
          type: 'string',
          example: 'linkToken=abc123; Path=/; HttpOnly; Secure; SameSite=Strict',
        },
      },
    },
  })
  async linkCallbackByKakao(@Req() req: Request, @Res() res: Response, @Query('code') code: string) {
    const command = new KakaoLinkLoginCommand(code);

    let result: { type: 'link'; linkToken: string; email: string } | { type: 'existed' };

    result = await this.commandBus.execute(command);

    if (result.type === 'existed') {
      let redirectURL = process.env.BASE_URL;
      res.redirect(`${redirectURL}/my/account?error=existed`);
    }

    if (result.type === 'link') {
      res.cookie('linkToken', result.linkToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.MODE_ENV === 'prod' ? 'strict' : 'none',
        expires: new Date(Date.now() + 3600000), // 현재 시간 + 1시간
      });

      res.redirect(`${process.env.BASE_URL}/my/account`);
    }
  }

  // google //

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
      });

      let redirectURL = process.env.BASE_URL;
      if (process.env.MODE_ENV === 'dev') {
        redirectURL = redirectURL + `?token=` + result.refreshToken;
      }

      res.redirect(`${redirectURL}`);
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
  @Get('me/oauth/profile')
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

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Post('me/oauth/link')
  @ApiOperation({
    summary: '계정 연동',
    description: `**계정을 연동하는 API 입니다.**  
    /users/(:연결하고자하는 oauth)/link API를 사용하여 linkToken를 발급 받아 쿠키에 있는 상태 입니다.
    `,
  })
  @ApiResponse({
    status: 200,
    description: '이메일, oauth 이미지 URL 데이터',
    schema: { example: '연동이 완료 되었습니다.' },
  })
  @ApiResponse({
    status: 401,
    description: '쿠키가 존재하지 않음',
  })
  async linkOauth(@CurrentUser() user: CurrentUserType, @Req() req: Request, @Res() res: Response): Promise<void> {
    const userId = user.id;
    const linkToken = req.cookies['linkToken'];

    if (!linkToken) {
      throw new UnauthorizedException('linkToken이 쿠키에 없습니다.');
    }

    const command = new LinkOauthCommand(userId, linkToken);
    await this.commandBus.execute(command);

    res.clearCookie('linkToken');
    res.status(200).send({ message: '연동이 완료되었습니다.' });
  }

  @Get('google/link')
  @ApiOperation({ summary: '구글 연동 (응답은 /google/link/callback API 확인)' })
  async linkByGoogle(@Res() res: Response) {
    const command = new GoogleLinkCodeCommand();

    const result = await this.commandBus.execute(command);

    res.redirect(result);
  }

  @Get('google/link/callback')
  @ApiOperation({
    summary: '연동 시도에 대한 카카오 서버에 대한 응답 (/google/link 리다이렉트 API)',
    description: `존재하는 계정 - refreshToken, 연동 가능 계정 - linkToken`,
  })
  @ApiResponse({
    status: 200,
    description: '로그인되어 홈으로 리다이렉트',
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
    status: 201,
    description: '회원가입이 되어있지 않아 연동가능, linkToken 발급',
    headers: {
      'Set-Cookie': {
        description: 'Cookie header',
        schema: {
          type: 'string',
          example: 'linkToken=abc123; Path=/; HttpOnly; Secure; SameSite=Strict',
        },
      },
    },
  })
  async linkCallbackByGoogle(@Req() req: Request, @Res() res: Response, @Query('code') code: string) {
    const command = new GoogleLinkLoginCommand(code);

    let result: { type: 'link'; linkToken: string; email: string } | { type: 'existed' };

    result = await this.commandBus.execute(command);

    if (result.type === 'existed') {
      let redirectURL = process.env.BASE_URL;
      res.redirect(`${redirectURL}/my/account?error=existed`);
    }

    if (result.type === 'link') {
      res.cookie('linkToken', result.linkToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.MODE_ENV === 'prod' ? 'strict' : 'none',
        expires: new Date(Date.now() + 3600000), // 현재 시간 + 1시간
      });

      res.redirect(`${process.env.BASE_URL}/my/account`);
    }
  }
}
