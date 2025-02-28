import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessJwtAuthGuard, SignupJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { KakaoCodeCommand } from '../application/command/kakao-code.command';
import { KakaoLoginCommand } from '../application/command/kakao-login.command';
import { GoogleCodeCommand } from '../application/command/google-code.command';
import { GoogleLoginCommand } from '../application/command/google-login.command';
import { CurrentSignupType, CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
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
  @ApiOperation({ summary: '카카오 로그인' })
  @ApiResponse({
    status: 200,
    description: `302 - 로그인 완료    
    redirect - https://partyguham.com`,
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
    status: 302,
    description: `회원가입이 되어있지 않아 로그인 권한이 없음 / 회원가입 진행  
    redirect - https://partyguham.com/join`,
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
  @ApiResponse({
    status: 403,
    description: `- list\t\n
      1. 회원탈퇴하여 30일 보관중인 계정입니다.(USER_DELETED_30D)  
        - response body : recoverAccessToken  

      2. 로그인 불가 계정입니다.(USER_FORBIDDEN_DISABLED)`,
    schema: {
      example: {
        message: '회원 탈퇴 후 30일 보관 중인 계정입니다.',
        error: 'USER_DELETED_30D',
        statusCode: 403,
        recoverAccessToken: 'recoverAccessToken',
        path: '/dev/api/auth/admin/token',
        timestamp: '2025-02-28T08:26:27.395Z',
      },
    },
  })
  async signinByKakao(@Res() res: Response) {
    const command = new KakaoCodeCommand();

    const result = await this.commandBus.execute(command);

    res.redirect(result);
  }

  @ApiExcludeEndpoint()
  @Get('kakao/callback')
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
      res.cookie('signupToken', result.signupAccessToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.MODE_ENV === 'prod' ? 'strict' : 'none',
        expires: new Date(Date.now() + 3600000), // 현재 시간 + 1시간
      });

      res.redirect(`${process.env.BASE_URL}/join`);
    }
  }

  // google //

  @Get('google/login')
  @ApiOperation({ summary: '구글 로그인' })
  @ApiResponse({
    status: 200,
    description: `302 - 로그인 완료    
    redirect - https://partyguham.com`,
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
    status: 302,
    description: `회원가입이 되어있지 않아 로그인 권한이 없음 / 회원가입 진행  
    redirect - https://partyguham.com/join`,
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
  @ApiResponse({
    status: 403,
    description: `- list\t\n
      1. 회원탈퇴하여 30일 보관중인 계정입니다.(USER_DELETED_30D)  
        - response body : recoverAccessToken  

      2. 로그인 불가 계정입니다.(USER_FORBIDDEN_DISABLED)`,
    schema: {
      example: {
        message: '회원 탈퇴 후 30일 보관 중인 계정입니다.',
        error: 'USER_DELETED_30D',
        statusCode: 403,
        recoverAccessToken: 'recoverAccessToken',
        path: '/dev/api/auth/admin/token',
        timestamp: '2025-02-28T08:26:27.395Z',
      },
    },
  })
  async signinByGoogle(@Res() res: Response) {
    const command = new GoogleCodeCommand();

    const result = await this.commandBus.execute(command);

    res.redirect(result);
  }

  @ApiExcludeEndpoint()
  @Get('google/callback')
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
  async getData(@CurrentUser() user: CurrentSignupType, @Req() req: Request) {
    const email = user.email;
    const image = user.image;

    return { email, image };
  }

  /// Link

  @Get('kakao/link')
  @ApiOperation({
    summary: '카카오 계정 연동',
    description: `존재하는 계정 - refreshToken, 연동 가능 계정 - linkToken`,
  })
  @ApiResponse({
    status: 201,
    description: `302 - 회원가입이 되어있지 않아 연동가능, linkToken 발급
    redirect - /my/account`,
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
  @ApiResponse({
    status: 302,
    description: `연동 불가  
    redirect - /my/account?error=existed`,
  })
  async linkByKakao(@Res() res: Response) {
    const command = new KakaoLinkCodeCommand();

    const result = await this.commandBus.execute(command);

    res.redirect(result);
  }

  @ApiExcludeEndpoint()
  @Get('kakao/link/callback')
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

  @Get('google/link')
  @ApiOperation({
    summary: '구글 계정 연동 linkToken 발급',
    description: `존재하는 계정 - refreshToken, 연동 가능 계정 - linkToken`,
  })
  @ApiResponse({
    status: 201,
    description: `302 - 회원가입이 되어있지 않아 연동가능, linkToken 발급
    redirect - /my/account`,
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
  @ApiResponse({
    status: 302,
    description: `연동 불가  
    redirect - /my/account?error=existed`,
  })
  async linkByGoogle(@Res() res: Response) {
    const command = new GoogleLinkCodeCommand();

    const result = await this.commandBus.execute(command);

    res.redirect(result);
  }

  @ApiExcludeEndpoint()
  @Get('google/link/callback')
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
}
