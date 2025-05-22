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
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { UserCareerCreateRequestDto } from '../dto/request/userCareer.create.request.dto';
import { UserLocationCreateRequestDto } from '../dto/request/userLocation.create.request.dto';
import { UserLocationResponseDto } from '../dto/response/UserLocationResponseDto';
import { UserPersonalityResponseDto } from '../dto/response/UserPersonalityResponseDto';
import { UserCareerResponseDto } from '../dto/response/UserCareerResponseDto';

import { UserPersonalityCreateRequestDto } from '../dto/request/userPersonality.create.request.dto';

import { CreateUserLocationCommand } from '../../application/command/create-userLocation.command';
import { DeleteUserLocationCommand } from '../../application/command/delete-userLocation.command';

import { CreateUserPersonalityCommand } from '../../application/command/create.userPersonality.command';
import { DeleteUserPersonalityCommand } from '../../application/command/delete-userPersonality.command';
import { CreateUserCareerCommand } from '../../application/command/create-userCareer.command';
import { DeleteUserCareerCommand } from '../../application/command/delete-userCareer.command';
import { DeleteUserLocationsCommand } from '../../application/command/delete-userLocations.command';
import { DeleteUserPersonalityByQuestionCommand } from '../../application/command/delete-userPersonalityByQuestion.command';
import { DeleteUserCareersCommand } from '../../application/command/delete-userCareers.command';
import { UpdateUserCareerCommand } from '../../application/command/update-userCareer.command';
import { UpdateUserCareerRequestDto } from '../dto/request/update-userCareer.request.dto';
import { GetUserCareerQuery } from '../../application/query/get-userCareer.query';
import { GetUserCareerResponseDto } from '../dto/response/get-UserCareerResponseDto';
import { GetUserLocationQuery } from 'src/user/application/query/get-userLocation.query';

@ApiTags('user details - 유저 세부 프로필')
@Controller('users')
export class UserDetailsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

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
  async createUserLocation(@CurrentUser() user: CurrentUserType, @Body() body: UserLocationCreateRequestDto) {
    const { locations } = body;

    const command = new CreateUserLocationCommand(user.id, locations);

    const result = await this.commandBus.execute(command);

    return plainToInstance(UserLocationResponseDto, result);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Get('me/locations')
  @ApiOperation({ summary: '관심지역 조회' })
  @ApiResponse({
    status: 201,
    description: '유저 관심지역 조회',
    type: [UserLocationResponseDto],
  })
  async getUserLocation(@CurrentUser() user: CurrentUserType) {
    const command = new GetUserLocationQuery(user.id);

    const result = await this.queryBus.execute(command);

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
  async createUserPersonality(@CurrentUser() user: CurrentUserType, @Body() body: UserPersonalityCreateRequestDto) {
    const { personality } = body;
    const command = new CreateUserPersonalityCommand(user.id, personality);

    const result = await this.commandBus.execute(command);

    return plainToInstance(UserPersonalityResponseDto, result);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Get('me/personalities')
  @ApiOperation({ summary: '유저 성향 조회' })
  @ApiResponse({
    status: 201,
    description: '유저 성향 조회',
    type: [UserPersonalityResponseDto],
  })
  async getUserPersonality(@CurrentUser() user: CurrentUserType) {
    const command = new GetUserCareerQuery(user.id);

    const result = await this.queryBus.execute(command);

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
  @Get('me/careers')
  @ApiOperation({ summary: '유저 경력(커리어) 조회' })
  @ApiResponse({
    status: 200,
    description: '유저 경력 조회',
    type: [GetUserCareerResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: '경력 데이터가 존재하지 않습니다.',
  })
  async getUserCareer(@CurrentUser() user: CurrentUserType) {
    const command = new GetUserCareerQuery(user.id);

    const result = await this.queryBus.execute(command);

    return plainToInstance(GetUserCareerResponseDto, result);
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
  async createUserCareer(@CurrentUser() user: CurrentUserType, @Body() body: UserCareerCreateRequestDto) {
    const { career } = body;

    const command = new CreateUserCareerCommand(user.id, career);

    const result = await this.commandBus.execute(command);

    return plainToInstance(UserCareerResponseDto, result);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(AccessJwtAuthGuard)
  @Patch('me/careers')
  @ApiOperation({ summary: '유저 경력(커리어) 수정', description: 'careerType 변경 불가' })
  @ApiResponse({
    status: 201,
    description: '유저 경력 수정',
    type: [UserCareerResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: '변경 권한이 없습니다.',
  })
  async putUserCareer(@CurrentUser() user: CurrentUserType, @Body() body: UpdateUserCareerRequestDto) {
    const { career } = body;

    const command = new UpdateUserCareerCommand(user.id, career);

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
}
