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
import { CurrentSignupType, CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard, SignupJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UserParamRequestDto } from './dto/request/user.param.request.dto';
import { UserResponseDto } from './dto/response/UserResponseDto';
import { NicknameQueryRequestDto } from './dto/request/nickname.query.request.dto';
import { UserCareerCreateRequestDto } from './dto/request/userCareer.create.request.dto';
import { UserLocationCreateRequestDto } from './dto/request/userLocation.create.request.dto';
import { UserLocationResponseDto } from './dto/response/UserLocationResponseDto';
import { UserPersonalityResponseDto } from './dto/response/UserPersonalityResponseDto';
import { UserCareerResponseDto } from './dto/response/UserCareerResponseDto';
import { UapdateUserRequestDto } from './dto/request/update-user.request.dto';
import { UserPersonalityCreateRequestDto } from './dto/request/userPersonality.create.request.dto';
import { UsersMePartyQueryDto } from './dto/request/users.me.query.dto';

import { CreateUserCommand } from '../application/command/create-user.command';
import { UpdateUserCommand } from '../application/command/update-user.command';
import { CreateUserLocationCommand } from '../application/command/create-userLocation.command';
import { DeleteUserLocationCommand } from '../application/command/delete-userLocation.command';

import { GetUserQuery } from '../application/query/get-user.query';
import { UserByNicknameQuery } from '../application/query/get-user-by-nickname.query';
import { GetCheckNicknameQuery } from '../application/query/get-check-nickname.query';

import { CreateUserPersonalityCommand } from '../application/command/create.userPersonality.command';
import { DeleteUserPersonalityCommand } from '../application/command/delete-userPersonality.command';
import { CreateUserCareerCommand } from '../application/command/create-userCareer.command';
import { DeleteUserCareerCommand } from '../application/command/delete-userCareer.command';
import { DeleteUserCommand } from '../application/command/delete-user.command';
import { DeleteUserLocationsCommand } from '../application/command/delete-userLocations.command';
import { DeleteUserPersonalityByQuestionCommand } from '../application/command/delete-userPersonalityByQuestion.command';
import { DeleteUserCareersCommand } from '../application/command/delete-userCareers.command';

import { GetMyPartiesQuery } from '../application/query/get-myParties.query';
import { GetMyPartiesResponseDto } from './dto/response/myPartiesDto';
import { GetMyPartyApplicationsQuery } from '../application/query/get-myPartyApplications.query';
import { GetMyPartyApplicationResponseDto } from './dto/response/myPartyApplicationsDto';
import { GetUserOauthQuery } from '../application/query/get-userOauth.query';

@ApiTags('user (회원/유저)')
@Controller('users')
export class UserController {
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
      sameSite: process.env.MODE_ENV === 'prod' ? 'strict' : 'none',
    });
    res.status(201).send({ accessToken: result.accessToken });
  }

  @ApiBearerAuth('accessToken')
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

    const command = new CreateUserLocationCommand(user.id, locations);

    const result = await this.commandBus.execute(command);

    return plainToInstance(UserLocationResponseDto, result);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Delete('me/locations')
  @ApiOperation({ summary: '관심지역 전체 삭제' })
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
  async deleteAllLocation(@CurrentUser() user: CurrentUserType) {
    const command = new DeleteUserLocationsCommand(user.id);

    await this.commandBus.execute(command);
  }

  @ApiBearerAuth('accessToken')
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
  async deleteLocation(@CurrentUser() user: CurrentUserType, @Param('userLocationId') userLocationId: number) {
    const command = new DeleteUserLocationCommand(user.id, userLocationId);

    await this.commandBus.execute(command);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Post('me/personalities')
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
    const command = new CreateUserPersonalityCommand(user.id, personality);

    const result = await this.commandBus.execute(command);

    return plainToInstance(UserPersonalityResponseDto, result);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Delete('me/personalities/questions/:personalityQuestionId')
  @ApiOperation({ summary: '질문에 대한 저장된 응답 전체 삭제' })
  @ApiParam({ name: 'personalityQuestionId', description: '질문지 ID' })
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
    @Param('personalityQuestionId') personalityQuestionId: number,
  ) {
    const command = new DeleteUserPersonalityByQuestionCommand(user.id, personalityQuestionId);

    await this.commandBus.execute(command);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Delete('me/personalities/options/:userPersonalityId')
  @ApiOperation({ summary: '저장된 응답 항목 1개 삭제' })
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
  async deleteUserPersonalityOptions(
    @CurrentUser() user: CurrentUserType,
    @Param('userPersonalityId') userPersonalityId: number,
  ) {
    const command = new DeleteUserPersonalityCommand(user.id, userPersonalityId);

    await this.commandBus.execute(command);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Post('me/careers')
  @ApiOperation({ summary: '유저 경력(커리어) 저장' })
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
  async createUserCarrer(@CurrentUser() user: CurrentUserType, @Body() body: UserCareerCreateRequestDto) {
    const { career } = body;

    const command = new CreateUserCareerCommand(user.id, career);

    const result = await this.commandBus.execute(command);

    return plainToInstance(UserCareerResponseDto, result);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Delete('me/careers')
  @ApiOperation({ summary: '유저 경력 전체 삭제' })
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
  async deleteUserCareers(@CurrentUser() user: CurrentUserType) {
    const command = new DeleteUserCareersCommand(user.id);

    await this.commandBus.execute(command);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Delete('me/careers/:userCareerId')
  @ApiOperation({ summary: '유저 경력 삭제' })
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
    const command = new DeleteUserCareerCommand(user.id, userCareerId);

    await this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('nickname/:nickname')
  @ApiOperation({ summary: '닉네임으로 유저 조회' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 유저 정보를 가져왔습니다.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '데이터를 찾을 수 없습니다.',
  })
  async getUser(@Param() param: UserParamRequestDto) {
    const userInfoByNickname = new UserByNicknameQuery(param.nickname);

    const result = this.queryBus.execute(userInfoByNickname);

    return plainToInstance(UserResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: '내정보 조회',
    description: `**내 정보를 조회하는 API 입니다.**   
    Query에 sort/order는 partyUsers(파티원)에 참여 여부에 대해 적용되는 내용입니다.`,
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 내정보 목록을 가져왔습니다.',
    type: UserResponseDto,
  })
  async getMyInfo(@CurrentUser() user: CurrentUserType): Promise<UserResponseDto> {
    const getUserInfoQuery = new GetUserQuery(user.id);

    const result = this.queryBus.execute(getUserInfoQuery);

    return plainToInstance(UserResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('me/oauth')
  @ApiOperation({
    summary: '나의 소셜 계정 조회',
    description: `**나의 소셜 계정을 전체 조회하는 API 입니다.**   
    `,
  })
  @ApiResponse({
    status: 200,
    description: '소셜 목록을 가져왔습니다. 연동된 소셜 계정만 배열안에 값을 표기합니다.',
    schema: { example: ['kakao, google'] },
  })
  async getMyOauth(@CurrentUser() user: CurrentUserType): Promise<UserResponseDto> {
    const getUserInfoQuery = new GetUserOauthQuery(user.id);

    const result = this.queryBus.execute(getUserInfoQuery);

    return result;
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('me/parties')
  @ApiOperation({
    summary: '나의 파티 조회',
    description: `**내가 속한 파티를 조회하는 API 입니다.**   
    party.status ='active'(진행중)  
    party.status = 'archived' (종료)  
    
    `,
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 목록을 가져왔습니다.',
    type: GetMyPartiesResponseDto,
  })
  async getParties(@CurrentUser() user: CurrentUserType, @Query() query: UsersMePartyQueryDto) {
    const { page, limit, sort, order } = query;

    const getUserInfoQuery = new GetMyPartiesQuery(user.id, page, limit, sort, order);

    const result = this.queryBus.execute(getUserInfoQuery);

    return plainToInstance(GetMyPartiesResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('me/parties/applications')
  @ApiOperation({
    summary: '나의 지원 목록',
    description: `**내가 지원한 모집공고를 조회하는 API 입니다.**   
    `,
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 목록을 가져왔습니다.',
    type: GetMyPartyApplicationResponseDto,
  })
  async getPartyRecruitments(@CurrentUser() user: CurrentUserType, @Query() query: UsersMePartyQueryDto) {
    const { page, limit, sort, order } = query;

    const getPartyApplicationQuery = new GetMyPartyApplicationsQuery(user.id, page, limit, sort, order);

    const result = this.queryBus.execute(getPartyApplicationQuery);

    return plainToInstance(GetMyPartyApplicationResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch('me')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: '내정보 변경',
    description: `**새로운 파티를 생성하는 API 입니다.**  
        1. 이미지는 multipart/form-data 형식을 사용합니다.  
        2. 이미지를 저장하는 key는 image 이며, 선택사항 (optional) 입니다.  
        \`\`\`image : 파티에 대한 이미지 파일을 업로드합니다. (jpg, png, jpeg 파일 첨부)  \`\`\`  
        `,
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 내정보를 변경 하였습니다.',
    type: UserResponseDto,
  })
  async updateUser(
    @CurrentUser() user: CurrentUserType,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UapdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const { gender, genderVisible, birth, birthVisible, portfolioTitle, portfolio } = body;
    const image = file ? file.path : null;

    const getUserInfoQuery = new UpdateUserCommand(
      user.id,
      gender,
      genderVisible,
      birth,
      birthVisible,
      portfolioTitle,
      portfolio,
      image,
    );
    const result = this.queryBus.execute(getUserInfoQuery);

    return plainToInstance(UserResponseDto, result);
  }

  @Delete('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 200,
    description: `'refreshToken' clearCookie`,
  })
  async logout(@Res() res: Response): Promise<void> {
    res.status(200).clearCookie('refreshToken').send();
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete('signout')
  @ApiOperation({ summary: '회원탈퇴' })
  async signout(@CurrentUser() user: CurrentUserType): Promise<void> {
    const userId = user.id;
    const command = new DeleteUserCommand(userId);

    return this.commandBus.execute(command);
  }

  // @UseGuards(AccessJwtAuthGuard)
  // @Patch('image')
  // @ApiOperation({ summary: '(개발중) 이미지 변경' })
  // @ApiResponse({
  //   status: 200,
  //   description: '.',
  //   type: UserResponseDto,
  // })
  // async updateImage(@CurrentUser() user: CurrentUserType,) {}

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
