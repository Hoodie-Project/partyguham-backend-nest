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
import { CurrentRecoverType, CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard, RecoverJwtAuthGuard, SignupJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { DeleteUserCommand } from '../application/command/delete-user.command';
import { RecoverUserCommand } from '../application/command/recover-user.command';

@ApiTags('user status (회원 상태(계정) 관리)')
@Controller('users')
export class UserStatusController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}
  @Delete('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 200,
    description: `'refreshToken' clearCookie`,
  })
  async logout(@Res() res: Response): Promise<void> {
    res.status(200).clearCookie('refreshToken').send();
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Delete('signout')
  @HttpCode(204)
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiResponse({ status: 204, description: '회원 탈퇴 성공' })
  @ApiResponse({ status: 403, description: '파티장 권한이 있어 탈퇴 불가' })
  async signout(@CurrentUser() user: CurrentUserType): Promise<void> {
    const userId = user.id;
    const command = new DeleteUserCommand(userId);

    await this.commandBus.execute(command);
  }

  @ApiBearerAuth('accessToken')
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

  @ApiBearerAuth('accessToken')
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
