import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentRecoverType,
  CurrentSignupType,
  CurrentUser,
  CurrentUserType,
} from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard, RecoverJwtAuthGuard, SignupJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { DeleteUserCommand } from '../../application/command/delete-user.command';
import { RecoverUserCommand } from '../../application/command/recover-user.command';
import { NicknameQueryRequestDto } from '../dto/request/nickname.query.request.dto';
import { GetCheckNicknameQuery } from '../../application/query/get-check-nickname.query';
import { CreateUserRequestDto } from '../dto/request/create-user.request.dto';
import { CreateUserCommand } from '../../application/command/create-user.command';

@ApiTags('user status - 회원 상태, 계정 관리')
@Controller('users')
export class UserStatusController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @UseGuards(SignupJwtAuthGuard)
  @Get('check-nickname')
  @ApiOperation({
    summary: '닉네임 중복검사',
    description: `**닉네임 중복검사 API 입니다.**  
    signupToken을 이용하여 인증하고, 위치는 헤더(authorization) 또는 쿠키(signupToken) 으로 인증 가능합니다.  
    존재하지 않거나, 이중으로 존재할 시 401을 리턴합니다.
    `,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {signupToken}',
  })
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

  @UseGuards(SignupJwtAuthGuard)
  @Post('')
  @ApiOperation({
    summary: '필수회원가입 (유저생성)',
    description: `**필수 회원가입 API 입니다.**  
    signupToken을 이용하여 인증하고, 위치는 헤더(authorization) 또는 쿠키(signupToken) 으로 인증 가능합니다.  
    존재하지 않거나, 이중으로 존재할 시 401을 리턴합니다.
    `,
  })
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
    const { nickname, gender, birth } = dto;

    const oauthId = user.oauthId;
    const email = user.email;
    const image = user.image;

    const command = new CreateUserCommand(oauthId, email, image, nickname, gender, birth);

    const result = await this.commandBus.execute(command);

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.redirect(302, `${process.env.BASE_URL}`);
      }
    });

    res.clearCookie('signupToken', {
      secure: true,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
    });
    // 로그아웃 후에도 클라이언트에게 새로운 응답을 제공하기 위해 캐시 제어 헤더 추가
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    res.cookie('refreshToken', result.refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none',
    });
    res.status(201).send({ accessToken: result.accessToken });
  }

  @Delete('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 200,
    description: `'refreshToken' clearCookie`,
  })
  async logout(@Res() res: Response): Promise<void> {
    res
      .clearCookie('refreshToken', {
        secure: true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none', // CSRF 공격 방지
      })
      .status(200)
      .send();
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Delete('signout')
  @HttpCode(204)
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiResponse({ status: 204, description: '회원 탈퇴 성공' })
  @ApiResponse({ status: 403, description: '파티장 권한이 있어 탈퇴 불가' })
  async signout(@Res() res: Response, @CurrentUser() user: CurrentUserType): Promise<void> {
    const userId = user.id;
    const command = new DeleteUserCommand(userId);

    await this.commandBus.execute(command);

    res
      .clearCookie('refreshToken', {
        secure: true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none', // CSRF 공격 방지
      })
      .status(200)
      .send();
  }

  @ApiBearerAuth('recoverAccessToken')
  @UseGuards(RecoverJwtAuthGuard)
  @Post('recover/web')
  @ApiOperation({
    summary: '회원탈퇴 유저 복구',
    description: `**회원탈퇴 유저를 웹에서 복구 가능한 API 입니다.**  
    로그인을 시도하여 성공하지만 계정이 잠겨 있는 경우 RecoverAccessToken를 받아 복구 해야합니다.  
    복구가 완료되면 리턴 되는 값은 로그인 성공과 동일합니다.  
    redirect - https://partyguham.com
    `,
  })
  @ApiResponse({
    status: 302,
    description: '회원탈퇴 유저 복구 완료 redirect - https://partyguham.com',
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
  async userWebRecover(
    @CurrentUser() recover: CurrentRecoverType,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const command = new RecoverUserCommand(recover.userId, recover.oauthId);

    const result = await this.commandBus.execute(command);

    res
      .clearCookie('recoverToken', {
        secure: true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none', // CSRF 공격 방지
      })
      .cookie('refreshToken', result.refreshToken, {
        secure: true, // HTTPS 연결에서만 쿠키 전송
        httpOnly: true, // JavaScript에서 쿠키 접근 불가능
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'none', // CSRF 공격 방지
      });

    let redirectURL = process.env.BASE_URL;
    if (process.env.NODE_ENV === 'dev') {
      redirectURL = redirectURL + `?token=` + result.refreshToken;
    }

    res.redirect(`${redirectURL}`);
  }

  @ApiBearerAuth('recoverAccessToken')
  @UseGuards(RecoverJwtAuthGuard)
  @Post('recover/app')
  @ApiOperation({
    summary: '회원탈퇴 유저 복구',
    description: `**회원탈퇴 유저를 앱에서 복구 가능한 API 입니다.**  
    로그인을 시도하여 성공하지만 계정이 잠겨 있는 경우 RecoverAccessToken를 받아 복구 해야합니다.  
    복구가 완료되면 리턴 되는 값은 로그인 성공과 동일합니다.  
    `,
  })
  @ApiResponse({
    status: 200,
    description: '회원탈퇴 유저 복구 완료',
    schema: { example: { accessToken: 'accessToken', refreshToken: 'refreshToken' } },
  })
  async userAppRecover(
    @CurrentUser() recover: CurrentRecoverType,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const command = new RecoverUserCommand(recover.userId, recover.oauthId);

    const result = await this.commandBus.execute(command);

    res.status(200).json({ refreshToken: result.refreshToken, accessToken: result.accessToken });
  }
}
