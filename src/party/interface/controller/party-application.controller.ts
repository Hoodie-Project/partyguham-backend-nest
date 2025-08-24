import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PartyApplicationSwagger } from '../partyApplication.swagger';

import { PartyApplicationParamRequestDto } from '../dto/request/application/partyApplication.param.request.dto';

import { RejectionPartyApplicationCommand } from '../../application/command/apply/rejection-partyApplication.comand';
import { DeletePartyApplicationCommand } from '../../application/command/apply/delete-partyApplication.comand';
import { ApprovePartyApplicationCommand } from 'src/party/application/command/apply/approve-partyApplication.comand';

@ApiBearerAuth('AccessJwt')
@ApiTags('party application - 파티 지원')
@UseGuards(AccessJwtAuthGuard)
@Controller('parties')
export class PartyApplicationController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post(':partyId/applications/:partyApplicationId/approval')
  @PartyApplicationSwagger.approvePartyApplication()
  async approvePartyApplication(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new ApprovePartyApplicationCommand(currentUser.userId, param.partyId, param.partyApplicationId);

    return this.commandBus.execute(command);
  }

  @Post(':partyId/applications/:partyApplicationId/rejection')
  @PartyApplicationSwagger.rejectPartyApplication()
  async rejectPartyApplication(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new RejectionPartyApplicationCommand(currentUser.userId, param.partyId, param.partyApplicationId);

    return this.commandBus.execute(command);
  }

  @HttpCode(204)
  @Delete(':partyId/applications/:partyApplicationId')
  @PartyApplicationSwagger.deletePartyApplication()
  @ApiOperation({ summary: '파티 지원 삭제(취소)' })
  async deletePartyApplication(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new DeletePartyApplicationCommand(currentUser.userId, param.partyId, param.partyApplicationId);

    return this.commandBus.execute(command);
  }
}
