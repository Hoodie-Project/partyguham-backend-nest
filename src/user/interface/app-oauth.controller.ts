import { CommandBus } from '@nestjs/cqrs';
import { Body, Controller, Headers, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { KakaoAppLoginCommand } from '../application/command/kakao-app-login.command';
import { GoogleAppLoginCommand } from '../application/command/google-app-login.command';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { AppLinkRequestDto } from './dto/request/app-link.request.dto';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { KakaoAppLinkCommand } from '../application/command/kakao-app-link.command';
import { GoogleAppLinkCommand } from '../application/command/google-app-link.command';

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

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Post('kakao/app/link')
  @ApiOperation({
    summary: 'App Kakao 연동',
  })
  @ApiHeader({
    name: 'Authorization',
    description: `Bearer {access token}
    `,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '카카오 계정이 연동 되었습니다.',
    schema: { example: { message: '카카오 계정이 연동 되었습니다.' } },
  })
  @ApiResponse({
    status: 409,
    description: '해당 카카오 계정은 이미 회원가입된 계정',
    schema: {
      example: { message: '연동 불가능한 계정 입니다.' },
    },
  })
  async kakaoAppLink(
    @CurrentUser() user: CurrentUserType,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: AppLinkRequestDto,
  ) {
    const userId = user.id;

    const command = new KakaoAppLinkCommand(userId, body.oauthAccessToken);

    const result = await this.commandBus.execute(command);

    // 이미 회원가입 되어있는 계정
    if (result.type === 'existed') {
      res.status(409).json({ message: '연동 불가능한 계정 입니다.' });
    }

    // 연동됨
    if (result.type === 'link') {
      res.status(200).json({
        message: '카카오 계정이 연동 되었습니다.',
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

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Post('google/app/link')
  @ApiOperation({
    summary: 'App Google 연동',
  })
  @ApiHeader({
    name: 'Authorization',
    description: `Bearer {access token}
    `,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '구글 계정이 연동 되었습니다.',
    schema: { example: { message: '구글 계정이 연동 되었습니다.' } },
  })
  @ApiResponse({
    status: 409,
    description: '해당 구글 계정은 이미 회원가입된 계정',
    schema: {
      example: { message: '연동 불가능한 계정 입니다.' },
    },
  })
  async googleAppLink(
    @CurrentUser() user: CurrentUserType,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: AppLinkRequestDto,
  ) {
    const userId = user.id;

    const command = new GoogleAppLinkCommand(userId, body.oauthAccessToken);

    const result = await this.commandBus.execute(command);

    // 이미 회원가입 되어있는 계정
    if (result.type === 'existed') {
      res.status(409).json({ message: '연동 불가능한 계정 입니다.' });
    }

    // 연동됨
    if (result.type === 'link') {
      res.status(200).json({
        message: '구글 계정이 연동 되었습니다.',
      });
    }
  }
}
