import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PartyRecruitmentSwagger } from './partyRecruitment.swagger';

import { PartyRequestDto } from './dto/request/party.param.request.dto';
import { CreatePartyRecruitmentRequestDto } from './dto/request/create-partyRecruitment.request.dto';
import { CreatePartyApplicationRequestDto } from './dto/request/create-application.request.dto';
import { PartyRecruitmentsParamRequestDto } from './dto/request/partyRecruitment.param.request.dto';
import { PartyRecruitmentsResponseDto } from './dto/response/party-recruitments.response.dto';
import { PartyRecruitmentParamRequestDto } from './dto/request/partyRecruitment.param.request.dto copy';
import { PartyRecruitmentQueryRequestDto } from './dto/request/partyRecruitment.query.request.dto';
import { PartyRecruitmentResponseDto } from './dto/response/party-recruitment.response.dto';

import { CreatePartyApplicationCommand } from '../application/command/create-partyApplication.comand';
import { CreatePartyRecruitmentCommand } from '../application/command/create-partyRecruitment.comand';
import { UpdatePartyRecruitmentCommand } from '../application/command/update-partyRecruitment.comand';
import { DeletePartyRecruitmentCommand } from '../application/command/delete-partyRecruitment.comand';

import { GetPartyApplicationsQuery } from '../application/query/get-partyApplications.query';
import { GetPartyRecruitmentsQuery } from '../application/query/get-partyRecruitments.query';
import { GetPartyRecruitmentQuery } from '../application/query/get-partyRecruitment.query';
import { DeletePartyRecruitmentBodyRequestDto } from './dto/request/delete-partyRecruitment.body.request.dto';
import { BatchDeletePartyRecruitmentCommand } from '../application/command/batchDelete-partyRecruitment.comand';

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
    const { sort, order, main } = query;

    const party = new GetPartyRecruitmentsQuery(param.partyId, sort, order, main);
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
  ): Promise<void> {
    const { positionId, content, recruiting_count } = body;

    const command = new CreatePartyRecruitmentCommand(user.id, param.partyId, positionId, content, recruiting_count);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch(':partyId/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.updateRecruitment()
  async updateRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
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

    return plainToInstance(PartyRecruitmentsResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Put(':partyId/recruitments')
  @PartyRecruitmentSwagger.batchDeleteRecruitment()
  @HttpCode(204)
  async batchDeleteRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Body() body: DeletePartyRecruitmentBodyRequestDto,
    @Param() param: PartyRequestDto,
  ): Promise<void> {
    const { partyRecruitmentIds } = body;

    const command = new BatchDeletePartyRecruitmentCommand(user.id, param.partyId, partyRecruitmentIds);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete(':partyId/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.deleteRecruitment()
  @HttpCode(204)
  async deleteRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
  ): Promise<void> {
    const command = new DeletePartyRecruitmentCommand(user.id, param.partyId, param.partyRecruitmentId);

    this.commandBus.execute(command);
  }

  // 지원
  @UseGuards(AccessJwtAuthGuard)
  @Post(':partyId/recruitments/:partyRecruitmentId/applications')
  @PartyRecruitmentSwagger.createPartyApplication()
  async createPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
    @Body() dto: CreatePartyApplicationRequestDto,
  ): Promise<void> {
    const command = new CreatePartyApplicationCommand(user.id, param.partyId, param.partyRecruitmentId, dto.message);

    return this.commandBus.execute(command);
  }

  // 지원자 조회시 최근 지원자
  @UseGuards(AccessJwtAuthGuard)
  @Get(':partyId/recruitments/:partyRecruitmentId/applications')
  @PartyRecruitmentSwagger.getPartyApplication()
  async getPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
  ): Promise<void> {
    const query = new GetPartyApplicationsQuery(user.id, param.partyId, param.partyRecruitmentId);

    return this.queryBus.execute(query);
  }
}
