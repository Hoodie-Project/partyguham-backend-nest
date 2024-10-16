import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PartyRecruitmentSwagger } from './partyRecruitment.swagger';

import { PartyApplicationParamRequestDto } from './dto/request/partyApplication.param.request.dto';

import { ApprovePartyApplicationCommand } from '../application/command/approve-partyApplication.comand';
import { RejectionPartyApplicationCommand } from '../application/command/rejection-partyApplication.comand';

@ApiBearerAuth('AccessJwt')
@ApiTags('party application (파티 지원자)')
@UseGuards(AccessJwtAuthGuard)
@Controller('parties')
export class PartyApplicationController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post(':partyId/applications/:partyApplicationId/approval')
  @PartyRecruitmentSwagger.approvePartyApplication()
  async approvePartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new ApprovePartyApplicationCommand(user.id, param.partyId, param.partyApplicationId);

    return this.commandBus.execute(command);
  }

  @Post(':partyId/applications/:partyApplicationId/rejection')
  @PartyRecruitmentSwagger.rejectPartyApplication()
  async rejectPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new RejectionPartyApplicationCommand(user.id, param.partyId, param.partyApplicationId);

    return this.commandBus.execute(command);
  }

  @Delete(':partyId/applications/:partyApplicationId')
  @ApiOperation({ summary: '파티 지원 삭제(취소)' })
  async deletePartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    // 지원자가 내정보에서 취소
  }
}
