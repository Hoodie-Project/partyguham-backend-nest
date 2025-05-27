import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PartyRecruitmentSwagger } from '../partyRecruitment.swagger';

import { PartyRequestDto } from '../dto/request/party.param.request.dto';
import { CreatePartyRecruitmentRequestDto } from '../dto/request/recruitment/create-partyRecruitment.request.dto';
import { CreatePartyApplicationRequestDto } from '../dto/request/application/create-application.request.dto';
import { PartyRecruitmentsParamRequestDto } from '../dto/request/recruitment/partyRecruitment.param.request.dto';
import { PartyRecruitmentsResponseDto } from '../dto/response/recruitment/party-recruitments.response.dto';
import { PartyRecruitmentParamRequestDto } from '../dto/request/recruitment/partyRecruitment.param.request.dto copy';
import { PartyRecruitmentQueryRequestDto } from '../dto/request/recruitment/partyRecruitment.query.request.dto';
import { PartyRecruitmentResponseDto } from '../dto/response/recruitment/party-recruitment.response.dto';
import { PartyApplicationQueryRequestDto } from '../dto/request/application/partyApplication.query.request.dto';
import { PartyApplicationsResponseDto } from '../dto/response/application/get-application.response.dto';
import { CreatePartyApplicationResponseDto } from '../dto/response/application/create-application.response.dto';
import { CreatePartyRecruitmentsResponseDto } from '../dto/response/recruitment/create-partyRecruitments.response.dto';
import { GetPartyApplicationMeQuery } from '../../application/query/get-partyApplicationMe.query';
import { PartyApplicationMeResponseDto } from '../dto/response/application/get-applicationMe.response.dto';

import { CreatePartyApplicationCommand } from '../../application/command/apply/create-partyApplication.comand';

import { GetPartyApplicationsQuery } from '../../application/query/get-partyApplications.query';
import { GetPartyRecruitmentsQuery } from '../../application/query/get-partyRecruitments.query';
import { GetPartyRecruitmentQuery } from '../../application/query/get-partyRecruitment.query';
import { CreatePartyRecruitmentCommand } from 'src/party/application/command/recruitment/create-partyRecruitment.comand';

@ApiTags('party recruitment (파티 모집 공고)')
@Controller('parties')
export class PartyRecruitmentController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.getPartyRecruitment()
  async getRecruitmentById(@Param() param: PartyRecruitmentParamRequestDto) {
    const party = new GetPartyRecruitmentQuery(param.partyRecruitmentId);

    const result = this.queryBus.execute(party);

    return plainToInstance(PartyRecruitmentResponseDto, result);
  }

  @Get(':partyId/recruitments')
  @PartyRecruitmentSwagger.getPartyRecruitments()
  async getPartyRecruitments(@Param() param: PartyRequestDto, @Query() query: PartyRecruitmentQueryRequestDto) {
    const { sort, order, status, main } = query;

    const party = new GetPartyRecruitmentsQuery(param.partyId, sort, order, status, main);
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyRecruitmentsResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post(':partyId/recruitments')
  @PartyRecruitmentSwagger.createRecruitment()
  async createRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() body: CreatePartyRecruitmentRequestDto,
  ) {
    const { positionId, content, recruiting_count } = body;

    const command = new CreatePartyRecruitmentCommand(user.id, param.partyId, positionId, content, recruiting_count);
    const result = this.commandBus.execute(command);

    return plainToInstance(CreatePartyRecruitmentsResponseDto, result);
  }

  // application
  // 모집공고에 지원
  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Post(':partyId/recruitments/:partyRecruitmentId/applications')
  @PartyRecruitmentSwagger.createPartyApplication()
  async createPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
    @Body() dto: CreatePartyApplicationRequestDto,
  ) {
    const command = new CreatePartyApplicationCommand(user.id, param.partyId, param.partyRecruitmentId, dto.message);

    const result = this.commandBus.execute(command);

    return plainToInstance(CreatePartyApplicationResponseDto, result);
  }

  // 모집공고 지원자 조회
  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Get(':partyId/recruitments/:partyRecruitmentId/applications')
  @PartyRecruitmentSwagger.getPartyApplication()
  async getPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
    @Query() query: PartyApplicationQueryRequestDto,
  ) {
    const { partyId, partyRecruitmentId } = param;
    const { page, limit, sort, order, status } = query;

    const application = new GetPartyApplicationsQuery(
      user.id,
      partyId,
      partyRecruitmentId,
      page,
      limit,
      sort,
      order,
      status,
    );

    const result = this.queryBus.execute(application);

    return plainToInstance(PartyApplicationsResponseDto, result);
  }

  // 모집공고 지원자 조회
  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Get(':partyId/recruitments/:partyRecruitmentId/applications/me')
  @PartyRecruitmentSwagger.getPartyApplicationMe()
  async getPartyApplicationMe(@CurrentUser() user: CurrentUserType, @Param() param: PartyRecruitmentsParamRequestDto) {
    const { partyId, partyRecruitmentId } = param;

    const application = new GetPartyApplicationMeQuery(user.id, partyId, partyRecruitmentId);

    const result = this.queryBus.execute(application);

    return plainToInstance(PartyApplicationMeResponseDto, result);
  }
}
