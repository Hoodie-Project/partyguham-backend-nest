import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Headers, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { KakaoAppLoginCommand } from '../application/command/kakao-app-login.command';
import { GoogleAppLoginCommand } from '../application/command/google-app-login.command';
import { AppSignupJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { NicknameQueryRequestDto } from './dto/request/nickname.query.request.dto';
import { GetCheckNicknameQuery } from '../application/query/get-check-nickname.query';
import { CurrentSignupType, CurrentUser } from 'src/common/decorators/auth.decorator';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { CreateUserCommand } from '../application/command/create-user.command';

@ApiTags('app-oauth (앱 오픈 인증)')
@Controller('app/users')
export class AppOauthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('kakao/login')
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

  @Post('google/login')
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

  @UseGuards(AppSignupJwtAuthGuard)
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

  @UseGuards(AppSignupJwtAuthGuard)
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
