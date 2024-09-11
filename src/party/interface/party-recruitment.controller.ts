import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PartyRecruitmentSwagger } from './partyRecruitment.swagger';

import { PartyRequestDto } from './dto/request/party.param.request.dto';
import { CreatePartyRecruitmentRequestDto } from './dto/request/create-partyRecruitment.request.dto';
import { CreatePartyApplicationRequestDto } from './dto/request/create-application.request.dto';
import { PartyRecruitmentParamRequestDto } from './dto/request/partyRecruitment.param.request.dto';

import { RecruitmentResponseDto } from './dto/response/recruitment.response.dto';

import { CreatePartyApplicationCommand } from '../application/command/create-partyApplication.comand';
import { CreatePartyRecruitmentCommand } from '../application/command/create-partyRecruitment.comand';
import { UpdatePartyRecruitmentCommand } from '../application/command/update-partyRecruitment.comand';
import { DeletePartyRecruitmentCommand } from '../application/command/delete-partyRecruitment.comand';

import { GetPartyApplicationsQuery } from '../application/query/get-partyApplications.query';
import { GetPartyRecruitmentQuery } from '../application/query/get-partyRecruitment.query';
import { PartyRecruitmentQueryRequestDto } from './dto/request/partyRecruitment.query.request.dto';

@ApiTags('party recruitment (파티 모집 공고)')
@UseGuards(AccessJwtAuthGuard)
@Controller('parties')
export class PartyRecruitmentController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}
  // 모집
  @Post(':partyId/recruitments')
  @PartyRecruitmentSwagger.createRecruitment()
  async createRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() body: CreatePartyRecruitmentRequestDto,
  ): Promise<void> {
    const { positionId, content, recruiting_count } = body;

    const command = new CreatePartyRecruitmentCommand(user.id, param.partyId, positionId, content, recruiting_count);

    return this.commandBus.execute(command);
  }

  //! 모집 공고 조회 방법 쿼리 -> 최근 등록일 추가
  @Get(':partyId/recruitments')
  @PartyRecruitmentSwagger.getPartyRecruitments()
  async getPartyRecruitments(@Param() param: PartyRequestDto, @Query() query: PartyRecruitmentQueryRequestDto) {
    const { sort, order, main } = query;

    const party = new GetPartyRecruitmentQuery(param.partyId, sort, order, main);
    const result = this.queryBus.execute(party);

    return plainToInstance(RecruitmentResponseDto, result);
  }

  @Patch(':partyId/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.updateRecruitment()
  async updateRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
    @Body() body: CreatePartyRecruitmentRequestDto,
  ) {
    const { positionId, recruiting_count } = body;

    const command = new UpdatePartyRecruitmentCommand(
      user.id,
      param.partyId,
      param.partyRecruitmentId,
      positionId,
      recruiting_count,
    );

    const result = this.commandBus.execute(command);

    return plainToInstance(RecruitmentResponseDto, result);
  }

  @Delete(':partyId/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.deleteRecruitment()
  async deleteRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
  ): Promise<void> {
    const command = new DeletePartyRecruitmentCommand(user.id, param.partyId, param.partyRecruitmentId);

    return this.commandBus.execute(command);
  }

  // 지원
  @Post(':partyId/recruitments/:partyRecruitmentId/applications')
  @PartyRecruitmentSwagger.createPartyApplication()
  async createPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
    @Body() dto: CreatePartyApplicationRequestDto,
  ): Promise<void> {
    const command = new CreatePartyApplicationCommand(user.id, param.partyId, param.partyRecruitmentId, dto.message);

    return this.commandBus.execute(command);
  }

  // 지원자 조회시 최근 지원자
  @Get(':partyId/recruitments/:partyRecruitmentId/applications')
  @PartyRecruitmentSwagger.getPartyApplication()
  async getPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
  ): Promise<void> {
    const query = new GetPartyApplicationsQuery(user.id, param.partyId, param.partyRecruitmentId);

    return this.queryBus.execute(query);
  }
}
