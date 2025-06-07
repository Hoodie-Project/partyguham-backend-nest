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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PartySwagger } from '../party.swagger';
import { PartyApplicationSwagger } from '../partyApplication.swagger';
import { PartyRecruitmentSwagger } from '../partyRecruitment.swagger';

import { PartyDelegationRequestDto } from '../dto/request/delegate-party.request.dto';
import { UpdatePartyUserRequestDto } from '../dto/request/update-partyUser.request.dto';
import { PartyUserParamRequestDto } from '../dto/request/partyUser.param.request.dto';

import { PartyRequestDto } from '../dto/request/party.param.request.dto';
import { UpdatePartyRequestDto } from '../dto/request/update-party.request.dto';
import { PartyUserQueryRequestDto } from '../dto/request/partyUser.query.request.dto';
import { GetAdminPartyUsersResponseDto } from '../dto/response/get-admin-partyUser.response.dto';
import { DeletePartyUsersBodyRequestDto } from '../dto/request/delete-partyUsers.body.request.dto';
import { PartyApplicationParamRequestDto } from '../dto/request/application/partyApplication.param.request.dto';
import { UpdatePartyResponseDto } from '../dto/response/update-party.response.dto';
import { PartyRecruitmentsParamRequestDto } from '../dto/request/recruitment/partyRecruitment.param.request.dto';
import { CreatePartyRecruitmentRequestDto } from '../dto/request/recruitment/create-partyRecruitment.request.dto';
import { PartyRecruitmentIdsBodyRequestDto } from '../dto/request/recruitment/partyRecruitmentIds.body.request.dto';
import { PartyRecruitmentsResponseDto } from '../dto/response/recruitment/party-recruitments.response.dto';

import { GetAdminPartyUserQuery } from '../../application/query/get-admin-partyUser.query';

import { UpdatePartyCommand } from '../../application/command/admin/update-party.comand';
import { DeletePartyCommand } from '../../application/command/admin/delete-party.comand';
import { DeletePartyImageCommand } from '../../application/command/admin/delete-partyImage.comand';
import { DeletePartyUserCommand } from '../../application/command/admin/delete-partyUser.comand';
import { DelegatePartyCommand } from '../../application/command/admin/delegate-party.comand';
import { UpdatePartyUserCommand } from '../../application/command/admin/update-partyUser.comand';
import { DeletePartyUsersCommand } from '../../application/command/admin/delete-partyUsers.comand';
import { ApproveAdminPartyApplicationCommand } from '../../application/command/admin/approve-adminPartyApplication.comand';
import { RejectionAdminPartyApplicationCommand } from '../../application/command/admin/rejection-adminPartyApplication.comand';
import { BatchDeletePartyRecruitmentCommand } from '../../application/command/admin/batchDelete-partyRecruitment.comand';
import { DeletePartyRecruitmentCommand } from '../../application/command/admin/delete-partyRecruitment.comand';
import { CompletedAdminPartyRecruitmentCommand } from '../../application/command/admin/completed-adminPartyRecruitment.comand';
import { UpdatePartyRecruitmentCommand } from '../../application/command/admin/update-partyRecruitment.comand';

@ApiBearerAuth('AccessJwt')
@UseGuards(AccessJwtAuthGuard)
@ApiTags('party admin - 파티 관리자')
@Controller('parties')
export class PartyAdminController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':partyId/admin/users')
  @PartySwagger.getAdminPartyUsers()
  async getAdminPartyUsers(@Param() param: PartyRequestDto, @Query() query: PartyUserQueryRequestDto) {
    const { page, limit, sort, order, main, nickname } = query;

    const party = new GetAdminPartyUserQuery(param.partyId, page, limit, sort, order, main, nickname);
    const result = this.queryBus.execute(party);

    return plainToInstance(GetAdminPartyUsersResponseDto, result);
  }

  @Patch(':partyId/admin')
  @UseInterceptors(FileInterceptor('image'))
  @PartySwagger.updateParty()
  async updateParty(
    @CurrentUser() user: CurrentUserType,
    @UploadedFile() file: Express.Multer.File,
    @Param() param: PartyRequestDto,
    @Body() dto: UpdatePartyRequestDto,
  ) {
    if (Object.keys(dto).length === 0 && !file) {
      throw new BadRequestException('변경하려는 이미지 또는 정보가 없습니다.', 'BAD_REQUEST');
    }
    const { partyTypeId, title, content, status } = dto;

    const command = new UpdatePartyCommand(user.id, param.partyId, partyTypeId, title, content, status, file);

    const result = this.commandBus.execute(command);

    return plainToInstance(UpdatePartyResponseDto, result);
  }

  @HttpCode(204)
  @Delete(':partyId/admin/image')
  @PartySwagger.deletePartyImage()
  async deletePartyImage(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyImageCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @PartySwagger.deleteParty()
  @Delete(':partyId/admin')
  async deleteParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  @PartySwagger.updatePartyUser()
  @Patch(':partyId/admin/users/:partyUserId')
  async updatePartyUser(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyUserParamRequestDto,
    @Body() body: UpdatePartyUserRequestDto,
  ) {
    const command = new UpdatePartyUserCommand(user.id, param.partyId, param.partyUserId, body.positionId);

    this.commandBus.execute(command);

    return { message: '파티 유저 포지션이 변경 되었습니다.' };
  }

  @HttpCode(204)
  @PartySwagger.kickUserFromParty()
  @Delete(':partyId/admin/users/:partyUserId')
  async kickUserFromParty(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyUserParamRequestDto,
  ): Promise<void> {
    const command = new DeletePartyUserCommand(user.id, param.partyId, param.partyUserId);

    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @PartySwagger.kickUsersFromParty()
  @Post(':partyId/admin/users/batch-delete')
  async kickUsersFromParty(
    @CurrentUser() user: CurrentUserType,
    @Body() body: DeletePartyUsersBodyRequestDto,
    @Param() param: PartyRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const { partyUserIds } = body;

    const command = new DeletePartyUsersCommand(user.id, param.partyId, partyUserIds);

    return this.commandBus.execute(command);
  }

  @Patch(':partyId/admin/recruitment/:partyRecruitmentId/completed')
  @PartyRecruitmentSwagger.completedPartyRecruitment()
  async completedPartyRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
  ): Promise<void> {
    const command = new CompletedAdminPartyRecruitmentCommand(user.id, param.partyId, param.partyRecruitmentId);

    return this.commandBus.execute(command);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Post(':partyId/admin/recruitment/batch-status')
  @PartyRecruitmentSwagger.updateRecruitmentStatusBatch()
  @HttpCode(200)
  async updateRecruitmentStatusBatch(
    @CurrentUser() user: CurrentUserType,
    @Body() body: PartyRecruitmentIdsBodyRequestDto,
    @Param() param: PartyRequestDto,
  ) {
    const { partyRecruitmentIds } = body;

    const command = new BatchDeletePartyRecruitmentCommand(user.id, param.partyId, partyRecruitmentIds);

    return this.commandBus.execute(command);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Patch(':partyId/admin/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.updateRecruitment()
  async updateRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
    @Body() body: CreatePartyRecruitmentRequestDto,
  ) {
    const { positionId, content, recruiting_count } = body;

    const command = new UpdatePartyRecruitmentCommand(
      user.id,
      param.partyId,
      param.partyRecruitmentId,
      positionId,
      content,
      recruiting_count,
    );

    const result = this.commandBus.execute(command);

    return plainToInstance(PartyRecruitmentsResponseDto, result);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Post(':partyId/admin/recruitments/batch-delete')
  @PartyRecruitmentSwagger.batchDeleteRecruitment()
  @HttpCode(204)
  async batchDeleteRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Body() body: PartyRecruitmentIdsBodyRequestDto,
    @Param() param: PartyRequestDto,
  ) {
    const { partyRecruitmentIds } = body;

    const command = new BatchDeletePartyRecruitmentCommand(user.id, param.partyId, partyRecruitmentIds);

    return this.commandBus.execute(command);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Delete(':partyId/admin/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.deleteRecruitment()
  @HttpCode(204)
  async deleteRecruitment(@CurrentUser() user: CurrentUserType, @Param() param: PartyRecruitmentsParamRequestDto) {
    const command = new DeletePartyRecruitmentCommand(user.id, param.partyId, param.partyRecruitmentId);

    this.commandBus.execute(command);
  }

  @Post(':partyId/admin/applications/:partyApplicationId/approval')
  @PartyApplicationSwagger.approveAdminPartyApplication()
  async approvePartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new ApproveAdminPartyApplicationCommand(user.id, param.partyId, param.partyApplicationId);

    return this.commandBus.execute(command);
  }

  @Post(':partyId/admin/applications/:partyApplicationId/rejection')
  @PartyApplicationSwagger.rejectAdminPartyApplication()
  async rejectPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new RejectionAdminPartyApplicationCommand(user.id, param.partyId, param.partyApplicationId);

    return this.commandBus.execute(command);
  }

  @HttpCode(200)
  @Patch(':partyId/admin/delegation')
  @PartySwagger.transferPartyLeadership()
  async transferPartyLeadership(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() dto: PartyDelegationRequestDto,
  ) {
    const command = new DelegatePartyCommand(user.id, param.partyId, dto.partyUserId);

    this.commandBus.execute(command);

    return { message: '파티장 권한이 변경 되었습니다.' };
  }
}
