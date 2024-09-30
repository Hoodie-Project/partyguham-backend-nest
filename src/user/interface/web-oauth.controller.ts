import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebSignupJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { KakaoCodeCommand } from '../application/command/kakao-code.command';
import { KakaoLoginCommand } from '../application/command/kakao-login.command';
import { GoogleCodeCommand } from '../application/command/google-code.command';
import { GoogleLoginCommand } from '../application/command/google-login.command';
import { CurrentSignupType, CurrentUser } from 'src/common/decorators/auth.decorator';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { GetCheckNicknameQuery } from '../application/query/get-check-nickname.query';
import { NicknameQueryRequestDto } from './dto/request/nickname.query.request.dto';
import { CreateUserCommand } from '../application/command/create-user.command';

@ApiTags('web-oauth (웹 오픈 인증)')
@Controller('users')
export class WebOauthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

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

    const result = await this.commandBus.execute(command);

    if (result.type === 'login') {
      res.cookie('refreshToken', result.refreshToken, {
        secure: true, // HTTPS 연결에서만 쿠키 전송
        httpOnly: true, // JavaScript에서 쿠키 접근 불가능
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none', // CSRF 공격 방지
      });

      res.status(200).redirect(`${process.env.BASE_URL}`);
    }

    if (result.type === 'signup') {
      req.session.email = result.email;
      req.session.image = result.image;

      res.cookie('signupToken', result.signupAccessToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
        expires: new Date(Date.now() + 3600000), // 현재 시간 + 1시간
      });

      res.status(401).redirect(`${process.env.BASE_URL}/join`);
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

    const result = await this.commandBus.execute(command);

    if (result.type === 'login') {
      res.cookie('refreshToken', result.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
      });
      res.json({ accessToken: result.accessToken });
      res.redirect(`${process.env.BASE_URL}`);
    }

    if (result.type === 'signup') {
      req.session.email = result.email;
      req.session.image = result.image;

      res.cookie('signupToken', result.signupAccessToken, {
        secure: true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
        expires: new Date(Date.now() + 3600000), // 현재 시간 + 1시간
      });

      res.status(401).redirect(`${process.env.BASE_URL}/join`);
    }
  }

  @ApiHeader({ name: 'cookies', description: 'signupToken' })
  @UseGuards(WebSignupJwtAuthGuard)
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

  @UseGuards(WebSignupJwtAuthGuard)
  @Get('check-nickname')
  @ApiOperation({ summary: '닉네임 중복검사' })
  @ApiResponse({
    status: 200,
    description: '사용가능한 닉네임 입니다.',
  })
  @ApiResponse({
    status: 409,
    description: '중복된 닉네임 입니다.',
  })
  async checkNickname(@Query() query: NicknameQueryRequestDto) {
    const { nickname } = query;

    const getUserInfoQuery = new GetCheckNicknameQuery(nickname);

    await this.queryBus.execute(getUserInfoQuery);

    return '사용가능한 닉네임 입니다.';
  }

  @UseGuards(WebSignupJwtAuthGuard)
  @Post('')
  @ApiOperation({ summary: '필수회원가입 (유저생성)' })
  @ApiResponse({
    status: 201,
    description: '회원가입하여 유저 생성 완료, 로그인 완료 (token 리턴)',
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
  async signUp(
    @CurrentUser() user: CurrentSignupType,
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: CreateUserRequestDto,
  ): Promise<void> {
    const { nickname, email, gender, birth } = dto;

    const oauthId = user.oauthId;
    const command = new CreateUserCommand(oauthId, nickname, email, gender, birth);

    const result = await this.commandBus.execute(command);

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.redirect(302, `${process.env.BASE_URL}`);
      }
    });

    res.clearCookie('signupToken');
    // 로그아웃 후에도 클라이언트에게 새로운 응답을 제공하기 위해 캐시 제어 헤더 추가
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    res.cookie('refreshToken', result.refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
    });
    res.status(201).send({ accessToken: result.accessToken });
  }
}
