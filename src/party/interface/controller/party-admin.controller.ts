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
import { UpdatePartyStatusRequestDto } from '../dto/request/update-partyStatus.request.dto';
import { UpdatePartyStatusCommand } from 'src/party/application/command/admin/update-partyStatus.comand';

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

  @Patch(':partyId/admin/info')
  @UseInterceptors(FileInterceptor('image'))
  @PartySwagger.updateParty()
  async updateParty(
    @CurrentUser() currentUser: CurrentUserType,
    @UploadedFile() file: Express.Multer.File,
    @Param() param: PartyRequestDto,
    @Body() dto: UpdatePartyRequestDto,
  ) {
    if (Object.keys(dto).length === 0 && !file) {
      throw new BadRequestException('변경하려는 이미지 또는 정보가 없습니다.', 'BAD_REQUEST');
    }
    const { partyTypeId, title, content } = dto;

    const command = new UpdatePartyCommand(currentUser.userId, param.partyId, partyTypeId, title, content, file);

    const result = this.commandBus.execute(command);

    return plainToInstance(UpdatePartyResponseDto, result);
  }

  @Patch(':partyId/admin/status')
  @PartySwagger.updatePartyStatus()
  async updatePartyStatus(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() dto: UpdatePartyStatusRequestDto,
  ) {
    const { status } = dto;

    const command = new UpdatePartyStatusCommand(currentUser.userId, param.partyId, status);

    const result = this.commandBus.execute(command);

    return plainToInstance(UpdatePartyResponseDto, result);
  }

  @HttpCode(204)
  @Delete(':partyId/admin/image')
  @PartySwagger.deletePartyImage()
  async deletePartyImage(@CurrentUser() currentUser: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyImageCommand(currentUser.userId, param.partyId);

    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @PartySwagger.deleteParty()
  @Delete(':partyId/admin')
  async deleteParty(@CurrentUser() currentUser: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyCommand(currentUser.userId, param.partyId);

    this.commandBus.execute(command);
  }

  @PartySwagger.updatePartyUser()
  @Patch(':partyId/admin/users/:partyUserId')
  async updatePartyUser(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyUserParamRequestDto,
    @Body() body: UpdatePartyUserRequestDto,
  ) {
    const command = new UpdatePartyUserCommand(currentUser.userId, param.partyId, param.partyUserId, body.positionId);

    this.commandBus.execute(command);

    return { message: '파티 유저 포지션이 변경 되었습니다.' };
  }

  @HttpCode(204)
  @PartySwagger.kickUserFromParty()
  @Delete(':partyId/admin/users/:partyUserId')
  async kickUserFromParty(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyUserParamRequestDto,
  ): Promise<void> {
    const command = new DeletePartyUserCommand(currentUser.userId, param.partyId, param.partyUserId);

    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @PartySwagger.kickUsersFromParty()
  @Post(':partyId/admin/users/batch-delete')
  async kickUsersFromParty(
    @CurrentUser() currentUser: CurrentUserType,
    @Body() body: DeletePartyUsersBodyRequestDto,
    @Param() param: PartyRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const { partyUserIds } = body;

    const command = new DeletePartyUsersCommand(currentUser.userId, param.partyId, partyUserIds);

    return this.commandBus.execute(command);
  }

  @Patch(':partyId/admin/recruitment/:partyRecruitmentId/completed')
  @PartyRecruitmentSwagger.completedPartyRecruitment()
  async completedPartyRecruitment(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
  ): Promise<void> {
    const command = new CompletedAdminPartyRecruitmentCommand(
      currentUser.userId,
      param.partyId,
      param.partyRecruitmentId,
    );

    return this.commandBus.execute(command);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Post(':partyId/admin/recruitment/batch-status')
  @PartyRecruitmentSwagger.updateRecruitmentStatusBatch()
  @HttpCode(200)
  async updateRecruitmentStatusBatch(
    @CurrentUser() currentUser: CurrentUserType,
    @Body() body: PartyRecruitmentIdsBodyRequestDto,
    @Param() param: PartyRequestDto,
  ) {
    const { partyRecruitmentIds } = body;

    const command = new BatchDeletePartyRecruitmentCommand(currentUser.userId, param.partyId, partyRecruitmentIds);

    return this.commandBus.execute(command);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Patch(':partyId/admin/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.updateRecruitment()
  async updateRecruitment(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
    @Body() body: CreatePartyRecruitmentRequestDto,
  ) {
    const { positionId, content, recruiting_count } = body;

    const command = new UpdatePartyRecruitmentCommand(
      currentUser.userId,
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
    @CurrentUser() currentUser: CurrentUserType,
    @Body() body: PartyRecruitmentIdsBodyRequestDto,
    @Param() param: PartyRequestDto,
  ) {
    const { partyRecruitmentIds } = body;

    const command = new BatchDeletePartyRecruitmentCommand(currentUser.userId, param.partyId, partyRecruitmentIds);

    return this.commandBus.execute(command);
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Delete(':partyId/admin/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.deleteRecruitment()
  @HttpCode(204)
  async deleteRecruitment(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
  ) {
    const command = new DeletePartyRecruitmentCommand(currentUser.userId, param.partyId, param.partyRecruitmentId);

    this.commandBus.execute(command);
  }

  @Post(':partyId/admin/applications/:partyApplicationId/approval')
  @PartyApplicationSwagger.approveAdminPartyApplication()
  async approvePartyApplication(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new ApproveAdminPartyApplicationCommand(
      currentUser.userId,
      param.partyId,
      param.partyApplicationId,
    );

    return this.commandBus.execute(command);
  }

  @Post(':partyId/admin/applications/:partyApplicationId/rejection')
  @PartyApplicationSwagger.rejectAdminPartyApplication()
  async rejectPartyApplication(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new RejectionAdminPartyApplicationCommand(
      currentUser.userId,
      param.partyId,
      param.partyApplicationId,
    );

    return this.commandBus.execute(command);
  }

  @HttpCode(200)
  @Patch(':partyId/admin/delegation')
  @PartySwagger.transferPartyLeadership()
  async transferPartyLeadership(
    @CurrentUser() currentUser: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() dto: PartyDelegationRequestDto,
  ) {
    const command = new DelegatePartyCommand(currentUser.userId, param.partyId, dto.partyUserId);

    this.commandBus.execute(command);

    return { message: '파티장 권한이 변경 되었습니다.' };
  }
}
