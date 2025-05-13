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
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserParamRequestDto } from '../dto/request/user.param.request.dto';
import { UserResponseDto } from '../dto/response/UserResponseDto';
import { mePartyApplicationQueryDto } from '../dto/request/me.partyApplication.query.dto';
import { UapdateUserRequestDto } from '../dto/request/update-user.request.dto';

import { mePartyQueryDto } from '../dto/request/me.party.query.dto';
import { GetMyPartiesResponseDto } from '../dto/response/myPartiesDto';
import { UpdateUserResponseDto } from '../dto/response/update-UserResponseDto';
import { GetMyPartyApplicationResponseDto } from '../dto/response/myPartyApplicationsDto';

import { UpdateUserCommand } from '../../application/command/update-user.command';

import { GetUserQuery } from '../../application/query/get-user.query';
import { UserByNicknameQuery } from '../../application/query/get-user-by-nickname.query';

import { GetMyPartiesQuery } from '../../application/query/get-myParties.query';
import { GetMyPartyApplicationsQuery } from '../../application/query/get-myPartyApplications.query';
import { GetUserOauthQuery } from '../../application/query/get-userOauth.query';
import { UserService } from 'src/user/application/user.service';

@ApiTags('user - 유저')
@Controller('users')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private userService: UserService,
  ) {}
  @ApiBearerAuth('accessToken')
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

  @ApiBearerAuth('accessToken')
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
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {accessToken}',
  })
  @ApiResponse({
    status: 200,
    description: '소셜 목록을 가져왔습니다. 연동된 소셜 계정만 배열안에 값을 표기합니다.',
    schema: {
      example: [
        {
          provider: 'google',
        },
        {
          provider: 'kakao',
        },
      ],
    },
  })
  async getMyOauth(@CurrentUser() user: CurrentUserType): Promise<UserResponseDto> {
    const getUserInfoQuery = new GetUserOauthQuery(user.id);

    const result = this.queryBus.execute(getUserInfoQuery);

    return result;
  }

  @ApiBearerAuth('accessToken')
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
  async getParties(@CurrentUser() user: CurrentUserType, @Query() query: mePartyQueryDto) {
    const { page, limit, sort, order, status } = query;

    const getUserInfoQuery = new GetMyPartiesQuery(user.id, page, limit, sort, order, status);

    const result = this.queryBus.execute(getUserInfoQuery);

    return plainToInstance(GetMyPartiesResponseDto, result);
  }

  @ApiBearerAuth('accessToken')
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
  async getPartyRecruitments(@CurrentUser() user: CurrentUserType, @Query() query: mePartyApplicationQueryDto) {
    const { page, limit, sort, order, status } = query;

    const getPartyApplicationQuery = new GetMyPartyApplicationsQuery(user.id, page, limit, sort, order, status);

    const result = this.queryBus.execute(getPartyApplicationQuery);

    return plainToInstance(GetMyPartyApplicationResponseDto, result);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Patch('me')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: '내정보 변경',
    description: `**새로운 파티를 생성하는 API 입니다.**  
        1. multipart/form-data 형식을 사용합니다. boolean 값을 string 으로 보내어도 서버에서 변환합니다.  
        2. 이미지를 저장하는 key는 image 이며, 선택사항 (optional) 입니다.  
        \`\`\`(key)image : (value) 파티에 대한 이미지 파일을 업로드합니다. - jpg, png, jpeg 파일 첨부   \`\`\`  
        `,
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 내정보를 변경 하였습니다.',
    type: UapdateUserRequestDto,
  })
  async updateUser(
    @CurrentUser() user: CurrentUserType,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UapdateUserRequestDto,
  ) {
    const { gender, genderVisible, birth, birthVisible, portfolioTitle, portfolio } = body;
    const imagePath = file ? file.path : undefined;

    const getUserInfoQuery = new UpdateUserCommand(
      user.id,
      gender,
      genderVisible,
      birth,
      birthVisible,
      portfolioTitle,
      portfolio,
      imagePath,
    );
    const result = await this.commandBus.execute(getUserInfoQuery);

    return plainToInstance(UpdateUserResponseDto, result);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Post('app-open')
  @ApiOperation({ summary: '앱 오픈 알람 받기' })
  @ApiResponse({
    status: 201,
    description: '등록이 완료되었습니다.',
  })
  @ApiResponse({
    status: 409,
    description: '이미 등록된 이메일입니다.',
  })
  async createAppNotification(@CurrentUser() user: CurrentUserType) {
    await this.userService.createAppOpenNotifications(user.id);

    return '등록이 완료되었습니다.';
  }
}
