import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentAccount } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { DecodedPayload } from 'src/auth/jwt.payload';

import { KakaoLoginCommand } from '../application/command/kakao-login.command';
import { CreateUserCommand } from '../application/command/create-user.command';
import { UpdateUserCommand } from '../application/command/update-user.command';
import { FollowCommand } from '../application/command/follow.command';
import { UnfollowCommand } from '../application/command/unfollow.command';

import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UserLoginRequestDto } from './dto/request/user-login.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { UserParamRequestDto } from './dto/request/user.param.request.dto';
import { UserNicknameQueryRequestDto, UserQueryRequestDto } from './dto/request/user.query.request.dto';

import { UserByNicknameQuery } from '../application/query/get-user-by-nickname.query';
import { GetUserQuery } from '../application/query/get-user.query';
import { GetUsersQuery } from '../application/query/get-users.query';

import { UserResponseDto, UsersResponseDto } from './dto/response/UserResponseDto';
import { FollowQueryRequestDto } from './dto/request/follow.user.request.dto';
import { GetFollowQuery } from '../application/query/get-follow.query';
import { FollowResponseDto } from './dto/response/FollowResponseDto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('test/signup')
  @ApiOperation({ summary: '일반 회원가입 (테스트 계정 구현 용도)' })
  async createUser(@Res() res: Response, @Body() dto: CreateUserRequestDto): Promise<void> {
    const { account, nickname, email, gender, birth } = dto;

    const command = new CreateUserCommand(account, nickname, email, gender, birth);

    const reuslt = await this.commandBus.execute(command);

    res.cookie('refreshToken', reuslt.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.send({ accessToken: reuslt.accessToken });
  }

  @Get('check-nickname')
  @ApiOperation({ summary: '닉네임 중복검사' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 유저 목록을 가져왔습니다.',
    type: UserResponseDto,
  })
  async checkNickname(@Query() query: UserNicknameQueryRequestDto) {}

  @Post('signin/kakao')
  @ApiOperation({ summary: '카카오 로그인' })
  async signinByKakao(@Res() res: Response, @Body() dto: UserLoginRequestDto) {
    const { accessToken } = dto;

    const command = new KakaoLoginCommand(accessToken);

    const reuslt = await this.commandBus.execute(command);

    res.cookie('refreshToken', reuslt.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.send({ accessToken: reuslt.accessToken });
  }

  @Post('signup/kakao')
  @ApiOperation({ summary: '카카오 회원가입' })
  async signUpByKakao(@Res() res: Response, @Body() dto: CreateUserRequestDto): Promise<void> {
    const { account, nickname, email, gender, birth } = dto;

    const command = new CreateUserCommand(account, nickname, email, gender, birth);

    const reuslt = await this.commandBus.execute(command);

    res.cookie('refreshToken', reuslt.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.send({ accessToken: reuslt.accessToken });
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch('signup/optional')
  @ApiOperation({ summary: '공통 2차 회원가입' })
  async signUpOptional(@CurrentAccount() payload: DecodedPayload, @Body() dto: UpdateUserRequestDto): Promise<void> {
    const { onlineStatus } = dto;

    const command = new UpdateUserCommand(payload.id, onlineStatus);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete('')
  @ApiOperation({ summary: '회원탈퇴' })
  async deleteUser(@CurrentAccount() payload: DecodedPayload, @Body() dto: UpdateUserRequestDto): Promise<void> {
    const { onlineStatus } = dto;

    const command = new UpdateUserCommand(payload.id, onlineStatus);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete('')
  @ApiOperation({ summary: '로그아웃' })
  async signOut(@CurrentAccount() payload: DecodedPayload): Promise<void> {}

  @UseGuards(AccessJwtAuthGuard)
  @Get('info')
  @ApiOperation({ summary: '내정보 조회' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 내정보 목록을 가져왔습니다.',
    type: UserResponseDto,
  })
  async getMyInfo(@CurrentAccount() account: DecodedPayload): Promise<UserResponseDto> {
    const getUserInfoQuery = new GetUserQuery(account.id);

    const result = this.queryBus.execute(getUserInfoQuery);

    return plainToInstance(UserResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch('info')
  @ApiOperation({ summary: '내정보 변경' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 내정보 목록을 가져왔습니다.',
    type: UserResponseDto,
  })
  async updateUser(@CurrentAccount() account: DecodedPayload): Promise<UserResponseDto> {
    const getUserInfoQuery = new GetUserQuery(account.id);

    const result = this.queryBus.execute(getUserInfoQuery);

    return plainToInstance(UserResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch('image')
  @ApiOperation({ summary: '이미지 변경' })
  @ApiResponse({
    status: 200,
    description: '.',
    type: UserResponseDto,
  })
  async updateImage(@CurrentAccount() account: DecodedPayload) {}

  @Get('info/:nickname')
  @ApiOperation({ summary: '닉네임으로 유저 조회' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 유저 목록을 가져왔습니다.',
    type: UserResponseDto,
  })
  async getUser(@Param() param: UserParamRequestDto) {
    const userInfoByNickname = new UserByNicknameQuery(param.nickname);

    const result = this.queryBus.execute(userInfoByNickname);

    return plainToInstance(UserResponseDto, result);
  }

  @Get('')
  @ApiOperation({ summary: '유저 다수 조회' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 유저 목록을 가져왔습니다.',
    type: UsersResponseDto,
  })
  async getUsers(@Query() query: UserQueryRequestDto) {
    const { page, limit, sort, order } = query;

    const userInfoByNickname = new GetUsersQuery(page, limit, sort, order);

    const result = this.queryBus.execute(userInfoByNickname);

    return plainToInstance(UserResponseDto, result);
  }

  //! MVP 제외
  @UseGuards(AccessJwtAuthGuard)
  @Get('follow')
  @ApiOperation({ summary: '팔로워, 팔로잉 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 팔로우 or 팔로잉이 조회 되었습니다.',
    type: FollowResponseDto,
  })
  async getFollow(
    @CurrentAccount() payload: DecodedPayload,
    @Query() query: FollowQueryRequestDto,
  ): Promise<FollowResponseDto> {
    const { page, limit, sort, order } = query;

    const userInfoByNickname = new GetFollowQuery(payload.id, page, limit, sort, order);

    const result = await this.queryBus.execute(userInfoByNickname);

    return plainToInstance(FollowResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('follow/:nickname')
  @ApiOperation({ summary: '팔로우' })
  @ApiResponse({
    status: 204,
    description: '성공적으로 팔로우 되었습니다.',
  })
  async follow(@CurrentAccount() payload: DecodedPayload, @Param() param: UserParamRequestDto) {
    const command = new FollowCommand(payload.id, param.nickname);

    await this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete('unfollow/:nickname')
  @ApiOperation({ summary: '언팔로우' })
  @ApiResponse({
    status: 204,
    description: '성공적으로 언팔로우 되었습니다.',
  })
  async unfollow(@CurrentAccount() payload: DecodedPayload, @Param() param: UserParamRequestDto) {
    const command = new UnfollowCommand(payload.id, param.nickname);

    await this.commandBus.execute(command);
  }
}
