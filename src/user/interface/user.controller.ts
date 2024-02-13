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
import { UserQueryRequestDto } from './dto/request/user.query.request.dto';

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

  @Post('')
  @ApiOperation({ summary: '일반 회원가입 - 카카오 로그인 안될 시 테스트용 구현, 카카오 완료시 해당 api 삭제' })
  async createUser(@Res() res: Response, @Body() dto: CreateUserRequestDto): Promise<void> {
    const { account, nickname, email } = dto;

    const command = new CreateUserCommand(account, nickname, email);

    const reuslt = await this.commandBus.execute(command);

    res.cookie('refreshToken', reuslt.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.send({ accessToken: reuslt.accessToken });
  }

  @Post('kakao/login')
  @ApiOperation({ summary: 'Kakao 로그인 / 자동 회원가입' })
  async login(@Res() res: Response, @Body() dto: UserLoginRequestDto) {
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

  @UseGuards(AccessJwtAuthGuard)
  @Patch('info')
  @ApiOperation({ summary: '추가 정보 기입 또는 수정' })
  async updateUser(@CurrentAccount() payload: DecodedPayload, @Body() dto: UpdateUserRequestDto): Promise<void> {
    const { isParty, meetingType, meetingWeek, meetingTime, mbti, skillIds } = dto;

    const command = new UpdateUserCommand(payload.id, isParty, meetingType, meetingWeek, meetingTime, mbti, skillIds);

    return this.commandBus.execute(command);
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

  // 팔로우
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
