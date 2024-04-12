import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentSignupType, CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard, SignupJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { KakaoCodeCommand } from '../application/command/kakao-code.command';
import { CreateUserCommand } from '../application/command/create-user.command';
import { UpdateUserCommand } from '../application/command/update-user.command';
import { FollowCommand } from '../application/command/follow.command';
import { UnfollowCommand } from '../application/command/unfollow.command';

import { CreateUserRequestDto } from './dto/request/create-user.request.dto';

import { UserParamRequestDto } from './dto/request/user.param.request.dto';
import { UserQueryRequestDto } from './dto/request/user.query.request.dto';

import { UserByNicknameQuery } from '../application/query/get-user-by-nickname.query';
import { GetUserQuery } from '../application/query/get-user.query';
import { GetUsersQuery } from '../application/query/get-users.query';

import { UserResponseDto } from './dto/response/UserResponseDto';
import { FollowQueryRequestDto } from './dto/request/follow.user.request.dto';
import { GetFollowQuery } from '../application/query/get-follow.query';
import { FollowResponseDto } from './dto/response/FollowResponseDto';
import { NicknameQueryRequestDto } from './dto/request/nickname.query.request.dto';
import { GetCheckNicknameQuery } from '../application/query/get-check-nickname.query';
import { KakaoLoginCommand } from '../application/command/kakao-login.command';
import { UserCareerCreateRequestDto } from './dto/request/userCareer.create.request.dto';

import { UserPersonalityCreateRequestDto } from './dto/request/userPersonality.create.request.dto';
import { UserLocationCreateCommand } from '../application/command/userLocation.create.command';
import { UserPersonalityCreateCommand } from '../application/command/userPersonality.create.command';
import { UserCareerCreateCommand } from '../application/command/userCareer.create.command';

import { UserLocationDeleteCommand } from '../application/command/userLocation.delete.command';

import { UserLocationResponseDto } from './dto/response/UserLocationResponseDto';
import { UserPersonalityResponseDto } from './dto/response/UserPersonalityResponseDto';
import { UserCareerResponseDto } from './dto/response/UserCareerResponseDto';
import { UserLocationDeleteRequestDto } from './dto/request/userLocation.delete.request.dto';
import { UserLocationCreateRequestDto } from './dto/request/userLocation.create.request.dto';
import { UserPersonalityDeleteCommand } from '../application/command/userPersonality.delete.command';
import { UserCareerDeleteCommand } from '../application/command/userCareer.delete.command';

@ApiTags('user API')
@Controller('users')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('kakao/login')
  @ApiOperation({ summary: '카카오 로그인' })
  async signinByKakao(@Res() res: Response) {
    const command = new KakaoCodeCommand();

    const result = await this.commandBus.execute(command);

    res.redirect(result);
  }

  @Get('kakao/callback')
  @ApiOperation({
    summary: '웹/앱 사용 X // 로그인 시도에 대한 카카오 서버에 대한 응답 (카카오 로그인 리다이렉트 API)',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 가능 (access - res.body / refresh - res.cookie)',
    schema: { example: { accessToken: 'token' } },
  })
  @ApiResponse({
    status: 401,
    description: '회원가입 필요',
    schema: { example: { signupAccessToken: 'token', email: 'example@email.com' } },
  })
  async kakaoCallback(@Req() req: Request, @Res() res: Response, @Query('code') code: string) {
    const command = new KakaoLoginCommand(code);

    const result = await this.commandBus.execute(command);

    if (result.type === 'login') {
      res.cookie('refreshToken', result.refreshToken, {
        // secure: true, // HTTPS 연결에서만 쿠키 전송
        httpOnly: true, // JavaScript에서 쿠키 접근 불가능
        sameSite: 'strict', // CSRF 공격 방지
      });

      res.redirect(`${process.env.BASE_URL}`);
    }

    if (result.type === 'signup') {
      req.session.email = result.email;
      req.session.image = result.image;

      res.cookie('signupToken', result.signupAccessToken, {
        // secure: true, // HTTPS 연결에서만 쿠키 전송
        httpOnly: true, // JavaScript에서 쿠키 접근 불가능
        sameSite: 'strict', // CSRF 공격 방지
        expires: new Date(Date.now() + 3600000), // 현재 시간 + 1시간
      });

      res.redirect(`${process.env.BASE_URL}join`);
    }
  }

  @ApiBearerAuth('SignupJwt')
  @UseGuards(SignupJwtAuthGuard)
  @Get('me/oauth')
  @ApiOperation({ summary: 'oauth 본인 데이터 호출 (email, image)' })
  @ApiResponse({
    status: 200,
    description: 'email, image',
  })
  async getData(@Req() req: Request) {
    const email = req.session.email;
    const image = req.session.image;

    return { email, image };
  }

  @ApiBearerAuth('SignupJwt')
  @UseGuards(SignupJwtAuthGuard)
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

  @ApiBearerAuth('SignupJwt')
  @UseGuards(SignupJwtAuthGuard)
  @Post('')
  @ApiOperation({ summary: '회원가입 (필수)' })
  @ApiResponse({
    status: 201,
    description: '로그인 가능 (access - res.body / refresh - res.cookie)',
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
        // res.redirect(302, `${process.env.BASE_URL}`);
      }
    });
    console.log('session', req.session);
    res.clearCookie('signupToken');
    // 로그아웃 후에도 클라이언트에게 새로운 응답을 제공하기 위해 캐시 제어 헤더 추가
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    res.cookie('refreshToken', result.refreshToken, {
      // secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
    res.status(201).send({ accessToken: result.accessToken });
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Post('me/locations')
  @ApiOperation({ summary: '관심지역 저장' })
  @ApiResponse({
    status: 201,
    description: '유저 관심지역 저장',
    type: [UserLocationResponseDto],
  })
  @ApiResponse({
    status: 409,
    description: '이미 저장된 데이터가 있습니다.',
  })
  async userLocation(@CurrentUser() user: CurrentUserType, @Body() body: UserLocationCreateRequestDto) {
    const { locations } = body;

    const command = new UserLocationCreateCommand(user.id, locations);

    const result = await this.commandBus.execute(command);

    return plainToInstance(UserLocationResponseDto, result);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Delete('me/locations/:userLocationId')
  @ApiOperation({ summary: '관심지역 삭제' })
  @ApiParam({ name: 'userLocationId', description: '저장된 유저관심지역 ID' })
  @ApiResponse({
    status: 204,
    description: '관심지역 삭제 성공',
  })
  @ApiResponse({
    status: 403,
    description: '삭제 권한이 없습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '데이터를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 500,
    description: '삭제 실패',
  })
  async deleteUserLocation(@CurrentUser() user: CurrentUserType, @Param('userLocationId') userLocationId: number) {
    const command = new UserLocationDeleteCommand(user.id, userLocationId);

    await this.commandBus.execute(command);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Post('me/personality')
  @ApiOperation({ summary: '성향 저장' })
  @ApiResponse({
    status: 201,
    description: '유저 성향 저장',
    type: [UserPersonalityResponseDto],
  })
  @ApiResponse({
    status: 409,
    description:
      '이미 설문조사를 한 항목이 있습니다. \t\n 질문에 대한 응답 개수 조건이 맞지 않는 항목이 있습니다. \t\n 질문에 맞지 않는 선택지가 있습니다.',
  })
  async userPersonality(@CurrentUser() user: CurrentUserType, @Body() body: UserPersonalityCreateRequestDto) {
    const { personality } = body;
    const command = new UserPersonalityCreateCommand(user.id, personality);

    const result = await this.commandBus.execute(command);

    return plainToInstance(UserPersonalityResponseDto, result);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Delete('me/personality/:userPersonalityId')
  @ApiOperation({ summary: '성향 삭제' })
  @ApiParam({ name: 'userPersonalityId', description: '저장된 유저성향 ID' })
  @ApiResponse({
    status: 204,
    description: '성향 삭제 성공',
  })
  @ApiResponse({
    status: 403,
    description: '삭제 권한이 없습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '데이터를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 500,
    description: '삭제 실패',
  })
  async deleteUserPersonality(
    @CurrentUser() user: CurrentUserType,
    @Param('userPersonalityId') userPersonalityId: number,
  ) {
    const command = new UserPersonalityDeleteCommand(user.id, userPersonalityId);

    await this.commandBus.execute(command);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Post('me/career')
  @ApiOperation({ summary: '경력 저장' })
  @ApiResponse({
    status: 201,
    description: '유저 경력 저장',
    type: [UserCareerResponseDto],
  })
  @ApiResponse({
    status: 409,
    description:
      '주 포지션에 이미 데이터가 존재합니다. \t\n 부 포지션에 이미 데이터가 존재합니다. \t\n 이미 저장된 포지션이 있습니다.',
  })
  async userPosition(@CurrentUser() user: CurrentUserType, @Body() body: UserCareerCreateRequestDto) {
    const { career } = body;

    const command = new UserCareerCreateCommand(user.id, career);

    const result = await this.commandBus.execute(command);

    return plainToInstance(UserCareerResponseDto, result);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Delete('me/career/:userCareerId')
  @ApiOperation({ summary: '유저 경력(커리어) 삭제' })
  @ApiParam({ name: 'userCareerId', description: '저장된 유저 경력(커리어) ID' })
  @ApiResponse({
    status: 204,
    description: '유저 경력(커리어) 삭제 성공',
  })
  @ApiResponse({
    status: 403,
    description: '삭제 권한이 없습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '데이터를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 500,
    description: '삭제 실패',
  })
  async deleteUserCareer(@CurrentUser() user: CurrentUserType, @Param('userCareerId') userCareerId: number) {
    const command = new UserCareerDeleteCommand(user.id, userCareerId);

    await this.commandBus.execute(command);
  }

  @Delete('logout')
  @ApiOperation({ summary: '로그아웃' })
  async logout(@Res() res: Response, @CurrentUser() user: CurrentUserType): Promise<void> {
    res.clearCookie('refreshToken');
  }

  // @UseGuards(AccessJwtAuthGuard)
  // @Delete('signout')
  // @ApiOperation({ summary: '(개발중) 회원탈퇴' })
  // async signout(@CurrentUser() user: CurrentUserType, @Body() body: UpdateUserRequestDto): Promise<void> {
  //   const command = new UpdateUserCommand(user.id);

  //   return this.commandBus.execute(command);
  // }

  // @UseGuards(AccessJwtAuthGuard)
  // @Get('me/info')
  // @ApiOperation({ summary: '(개발중) 내정보 조회' })
  // @ApiResponse({
  //   status: 200,
  //   description: '성공적으로 내정보 목록을 가져왔습니다.',
  //   type: UserResponseDto,
  // })
  // async getMyInfo(@CurrentUser() account): Promise<UserResponseDto> {
  //   const getUserInfoQuery = new GetUserQuery(account.id);

  //   const result = this.queryBus.execute(getUserInfoQuery);

  //   return plainToInstance(UserResponseDto, result);
  // }

  // @UseGuards(AccessJwtAuthGuard)
  // @Patch('info')
  // @ApiOperation({ summary: '(개발중) 내정보 변경' })
  // @ApiResponse({
  //   status: 200,
  //   description: '성공적으로 내정보 목록을 가져왔습니다.',
  //   type: UserResponseDto,
  // })
  // async updateUser(@CurrentUser() account): Promise<UserResponseDto> {
  //   const getUserInfoQuery = new GetUserQuery(account.id);

  //   const result = this.queryBus.execute(getUserInfoQuery);

  //   return plainToInstance(UserResponseDto, result);
  // }

  // @UseGuards(AccessJwtAuthGuard)
  // @Patch('image')
  // @ApiOperation({ summary: '(개발중) 이미지 변경' })
  // @ApiResponse({
  //   status: 200,
  //   description: '.',
  //   type: UserResponseDto,
  // })
  // async updateImage(@CurrentUser() account) {}

  // @Get('users/:nickname')
  // @ApiOperation({ summary: '닉네임으로 유저 조회' })
  // @ApiResponse({
  //   status: 200,
  //   description: '성공적으로 유저 목록을 가져왔습니다.',
  //   type: UserResponseDto,
  // })
  // async getUser(@Param() param: UserParamRequestDto) {
  //   const userInfoByNickname = new UserByNicknameQuery(param.nickname);

  //   const result = this.queryBus.execute(userInfoByNickname);

  //   return plainToInstance(UserResponseDto, result);
  // }

  // @Get('list')
  // @ApiOperation({ summary: '(개발중) 유저 다수 조회' })
  // @ApiResponse({
  //   status: 200,
  //   description: '성공적으로 유저 목록을 가져왔습니다.',
  //   type: UserResponseDto,
  // })
  // async getUsers(@Query() query: UserQueryRequestDto) {
  //   const { page, limit, sort, order } = query;

  //   const userInfoByNickname = new GetUsersQuery(page, limit, sort, order);

  //   const result = this.queryBus.execute(userInfoByNickname);

  //   return plainToInstance(UserResponseDto, result);
  // }

  //   @UseGuards(AccessJwtAuthGuard)
  //   @Get('follow')
  //   @ApiOperation({ summary: '(MVP 제외) 팔로워, 팔로잉 목록 조회' })
  //   @ApiResponse({
  //     status: 200,
  //     description: '성공적으로 팔로우 or 팔로잉이 조회 되었습니다.',
  //     type: FollowResponseDto,
  //   })
  //   async getFollow(
  //     @CurrentUser() user: CurrentUserType,
  //     @Query() query: FollowQueryRequestDto,
  //   ): Promise<FollowResponseDto> {
  //     const { page, limit, sort, order } = query;

  //     const userInfoByNickname = new GetFollowQuery(user.id, page, limit, sort, order);

  //     const result = await this.queryBus.execute(userInfoByNickname);

  //     return plainToInstance(FollowResponseDto, result);
  //   }

  //   @UseGuards(AccessJwtAuthGuard)
  //   @Post('follow/:nickname')
  //   @ApiOperation({ summary: '(MVP 제외) 팔로우' })
  //   @ApiResponse({
  //     status: 204,
  //     description: '성공적으로 팔로우 되었습니다.',
  //   })
  //   async follow(@CurrentUser() user: CurrentUserType, @Param() param: UserParamRequestDto) {
  //     const command = new FollowCommand(user.id, param.nickname);

  //     await this.commandBus.execute(command);
  //   }

  //   @UseGuards(AccessJwtAuthGuard)
  //   @Delete('unfollow/:nickname')
  //   @ApiOperation({ summary: '(MVP 제외) 언팔로우' })
  //   @ApiResponse({
  //     status: 204,
  //     description: '성공적으로 언팔로우 되었습니다.',
  //   })
  //   async unfollow(@CurrentUser() user: CurrentUserType, @Param() param: UserParamRequestDto) {
  //     const command = new UnfollowCommand(user.id, param.nickname);

  //     await this.commandBus.execute(command);
  //   }
}
