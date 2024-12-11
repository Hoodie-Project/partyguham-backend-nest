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
import { PartySwagger } from './party.swagger';

import { PartyDelegationRequestDto } from './dto/request/delegate-party.request.dto';
import { UpdatePartyUserRequestDto } from './dto/request/update-partyUser.request.dto';
import { PartyUserParamRequestDto } from './dto/request/partyUser.param.request.dto';

import { PartyRequestDto } from './dto/request/party.param.request.dto';
import { UpdatePartyRequestDto } from './dto/request/update-party.request.dto';
import { PartyResponseDto } from './dto/response/party.response.dto';
import { PartyUserQueryRequestDto } from './dto/request/partyUser.query.request.dto';
import { GetAdminPartyUsersResponseDto } from './dto/response/get-admin-partyUser.response.dto';
import { DeletePartyUsersBodyRequestDto } from './dto/request/delete-partyUsers.body.request.dto';

import { UpdatePartyCommand } from '../application/command/update-party.comand';
import { DeletePartyCommand } from '../application/command/delete-party.comand';
import { DeletePartyImageCommand } from '../application/command/delete-partyImage.comand';
import { DeletePartyUserCommand } from '../application/command/delete-partyUser.comand';
import { DelegatePartyCommand } from '../application/command/delegate-party.comand';
import { UpdatePartyUserCommand } from '../application/command/update-partyUser.comand';
import { EndPartyCommand } from '../application/command/end-party.comand';
import { ActivePartyCommand } from '../application/command/active-party.comand';
import { DeletePartyUsersCommand } from '../application/command/delete-partyUsers.comand';

import { GetAdminPartyUserQuery } from '../application/query/get-admin-partyUser.query';
import { PartyApplicationSwagger } from './partyApplication.swagger';
import { PartyApplicationParamRequestDto } from './dto/request/application/partyApplication.param.request.dto';
import { ApprovePartyApplicationCommand } from '../application/command/approve-partyApplication.comand';
import { RejectionPartyApplicationCommand } from '../application/command/rejection-partyApplication.comand';

@ApiBearerAuth('AccessJwt')
@ApiTags('party admin (파티 관리자)')
@Controller('parties')
export class PartyAdminController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @UseGuards(AccessJwtAuthGuard)
  @Get(':partyId/admin/users')
  @PartySwagger.getAdminPartyUsers()
  async getAdminPartyUsers(@Param() param: PartyRequestDto, @Query() query: PartyUserQueryRequestDto) {
    const { page, limit, sort, order, main, nickname } = query;

    const party = new GetAdminPartyUserQuery(param.partyId, page, limit, sort, order, main, nickname);
    const result = this.queryBus.execute(party);

    return plainToInstance(GetAdminPartyUsersResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch(':partyId')
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
    const { partyTypeId, title, content } = dto;
    const imageFilePath = file ? file.path : undefined;

    const command = new UpdatePartyCommand(user.id, param.partyId, partyTypeId, title, content, imageFilePath);

    const result = this.commandBus.execute(command);

    return plainToInstance(PartyResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @HttpCode(204)
  @Delete(':partyId/image')
  @PartySwagger.deletePartyImage()
  async deletePartyImage(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyImageCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @HttpCode(204)
  @PartySwagger.endParty()
  @Patch(':partyId/end')
  async endParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new EndPartyCommand(user.id, param.partyId);
    this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @HttpCode(204)
  @PartySwagger.activeParty()
  @Patch(':partyId/active')
  async activeParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new ActivePartyCommand(user.id, param.partyId);
    this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @HttpCode(204)
  @PartySwagger.deleteParty()
  @Delete(':partyId')
  async deleteParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @PartySwagger.updatePartyUser()
  @Patch(':partyId/users/:partyUserId')
  async updatePartyUser(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyUserParamRequestDto,
    @Body() body: UpdatePartyUserRequestDto,
  ): Promise<void> {
    const command = new UpdatePartyUserCommand(user.id, param.partyId, param.partyUserId, body.positionId);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @HttpCode(204)
  @PartySwagger.kickUserFromParty()
  @Delete(':partyId/users/:partyUserId')
  async kickUserFromParty(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyUserParamRequestDto,
  ): Promise<void> {
    const command = new DeletePartyUserCommand(user.id, param.partyId, param.partyUserId);

    this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @PartySwagger.kickUsersFromParty()
  @Post(':partyId/users/batch-delete')
  async kickUsersFromParty(
    @CurrentUser() user: CurrentUserType,
    @Body() body: DeletePartyUsersBodyRequestDto,
    @Param() param: PartyRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const { partyUserIds } = body;

    const command = new DeletePartyUsersCommand(user.id, param.partyId, partyUserIds);

    this.commandBus.execute(command);

    res.status(204);
  }

  @Post(':partyId/admin/applications/:partyApplicationId/approval')
  @PartyApplicationSwagger.approveAdminPartyApplication()
  async approvePartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new ApprovePartyApplicationCommand(user.id, param.partyId, param.partyApplicationId);

    return this.commandBus.execute(command);
  }

  @Post(':partyId/admin/applications/:partyApplicationId/rejection')
  @PartyApplicationSwagger.rejectAdminPartyApplication()
  async rejectPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new RejectionPartyApplicationCommand(user.id, param.partyId, param.partyApplicationId);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post(':partyId/delegation')
  @PartySwagger.transferPartyLeadership()
  async transferPartyLeadership(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() dto: PartyDelegationRequestDto,
  ): Promise<void> {
    const command = new DelegatePartyCommand(user.id, param.partyId, dto.delegateUserId);

    return this.commandBus.execute(command);
  }
}
