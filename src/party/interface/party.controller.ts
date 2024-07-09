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
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { CreatePartyCommand } from '../application/command/create-party.comand';
import { UpdatePartyCommand } from '../application/command/update-party.comand';
import { DeletePartyCommand } from '../application/command/delete-party.comand';
import { CreatePartyApplicationCommand } from '../application/command/create-partyApplication.comand';
import { CreatePartyRecruitmentCommand } from '../application/command/create-partyRecruitment.comand';
import { DeletePartyImageCommand } from '../application/command/delete-partyImage.comand';
import { UpdatePartyRecruitmentCommand } from '../application/command/update-partyRecruitment.comand';
import { DeletePartyRecruitmentCommand } from '../application/command/delete-partyRecruitment.comand';
import { ApprovePartyApplicationCommand } from '../application/command/approve-partyApplication.comand';
import { RejectionPartyApplicationCommand } from '../application/command/rejection-partyApplication.comand';

import { GetPartyApplicationsQuery } from '../application/query/get-partyApplications.query';
import { GetPartyRecruitmentQuery } from '../application/query/get-partyRecruitment.query';
import { GetPartiesQuery } from '../application/query/get-parties.query';
import { GetPartyQuery } from '../application/query/get-party.query';
import { GetPartyTypesQuery } from '../application/query/get-partyTypes.query';

import { PartyRequestDto } from './dto/request/party.param.request.dto';
import { CreatePartyRequestDto } from './dto/request/create-party.request.dto';
import { UpdatePartyRequestDto } from './dto/request/update-party.request.dto';
import { PartyQueryRequestDto } from './dto/request/party.query.request.dto';
import { CreatePartyRecruitmentRequestDto } from './dto/request/create-partyRecruitment.request.dto';
import { CreatePartyApplicationRequestDto } from './dto/request/create-application.request.dto';
import { PartyRecruitmentParamRequestDto } from './dto/request/partyRecruitment.param.request.dto';
import { PartyTypeResponseDto } from './dto/response/partyType.response.dto';
import { PartyResponseDto } from './dto/response/party.response.dto';
import { RecruitmentRequestDto } from './dto/request/recruitment.request.dto';
import { PartyApplicationParamRequestDto } from './dto/request/partyApplication.param.request.dto';
import { GetPartiesResponseDto } from './dto/response/get-parties.response.dto';
import { GetPartyResponseDto } from './dto/response/get-party.response.dto';

import { PartySwagger } from './party.swagger';
import { PartyRecruitmentSwagger } from './partyRecruitment.swagger';
import { RecruitmentResponseDto } from './dto/response/recruitment.response.dto';
import { PartyDelegationRequestDto } from './dto/request/delegate-party.request.dto';
import { DelegatePartyCommand } from '../application/command/delegate-party.comand';
import { PartyUserParamRequestDto } from './dto/request/partyUser.param.request.dto';
import { DeletePartyUserCommand } from '../application/command/delete-partyUser.comand';
import { LeavePartyCommand } from '../application/command/leave-party.comand';

@ApiTags('파티')
@UseGuards(AccessJwtAuthGuard)
@Controller('parties')
export class PartyController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('types')
  @PartySwagger.getTypes()
  async getPartyType() {
    const party = new GetPartyTypesQuery();
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyTypeResponseDto, result);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  @PartySwagger.createParty()
  async createParty(
    @CurrentUser() user: CurrentUserType,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePartyRequestDto,
  ): Promise<void> {
    const { title, content, partyTypeId, positionId } = dto;

    const imageFilePath = file ? file.path : null;

    const command = new CreatePartyCommand(user.id, title, content, imageFilePath, partyTypeId, positionId);

    return this.commandBus.execute(command);
  }

  @Get('')
  @PartySwagger.getParties()
  async getParties(@Query() query: PartyQueryRequestDto) {
    const { page, limit, sort, order } = query;

    const parties = new GetPartiesQuery(page, limit, sort, order);
    const result = this.queryBus.execute(parties);

    return plainToInstance(GetPartiesResponseDto, result);
  }

  @Get(':partyId')
  @PartySwagger.getParty()
  async getParty(@Param() param: PartyRequestDto) {
    const party = new GetPartyQuery(param.partyId);
    const result = this.queryBus.execute(party);

    return plainToInstance(GetPartyResponseDto, result);
  }

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
      throw new BadRequestException('변경하려는 이미지 또는 정보가 없습니다.');
    }
    const { partyTypeId, title, content } = dto;
    const imageFilePath = file ? file.path : undefined;

    const command = new UpdatePartyCommand(user.id, param.partyId, partyTypeId, title, content, imageFilePath);

    const result = this.commandBus.execute(command);

    return plainToInstance(PartyResponseDto, result);
  }

  @HttpCode(204)
  @PartySwagger.endParty()
  @Delete(':partyId')
  async endParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyCommand(user.id, param.partyId);
    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @PartySwagger.deleteParty()
  @Delete(':partyId')
  async deleteParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    //Deleted
    const command = new DeletePartyCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @PartySwagger.deletePartyInMe()
  @Delete(':partyId/me')
  async deletePartyInMe(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new LeavePartyCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @PartySwagger.deletePartyInUser()
  @Delete(':partyId/party-users/:partyUserId')
  async deletePartyInUser(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyUserParamRequestDto,
  ): Promise<void> {
    const command = new DeletePartyUserCommand(user.id, param.partyId, param.partyUserId);

    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @Delete(':partyId/image')
  @PartySwagger.deletePartyImage()
  async deletePartyImage(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyImageCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  // 모집
  @Post(':partyId/recruitments')
  @PartyRecruitmentSwagger.createRecruitment()
  async createRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() dto: CreatePartyRecruitmentRequestDto,
  ): Promise<void> {
    const command = new CreatePartyRecruitmentCommand(user.id, param.partyId, dto.recruitments);

    return this.commandBus.execute(command);
  }

  @Get(':partyId/recruitments')
  @PartyRecruitmentSwagger.getPartyRecruitments()
  async getPartyRecruitments(@Param() param: PartyRequestDto) {
    const party = new GetPartyRecruitmentQuery(param.partyId);
    const result = this.queryBus.execute(party);

    return plainToInstance(RecruitmentResponseDto, result);
  }

  @Patch(':partyId/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.updateRecruitment()
  async updateRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
    @Body() body: RecruitmentRequestDto,
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

  @Get(':partyId/recruitments/:partyRecruitmentId/applications')
  @PartyRecruitmentSwagger.getPartyApplication()
  async getPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
  ): Promise<void> {
    const query = new GetPartyApplicationsQuery(user.id, param.partyId, param.partyRecruitmentId);

    return this.queryBus.execute(query);
  }

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

  // @Delete(':partyId/applications/:partyApplicationId')
  // @ApiOperation({ summary: '파티 지원 삭제(취소)' })
  // async deletePartyApplication(@CurrentUser() user: CurrentUserType, @Param() param: PartyApplicationParamRequestDto,): Promise<void> {
  //   // 지원자만 내정보에서 취소 가능
  //   partyId;
  // }

  // 초대
  // @Post(':partyId/invitation/:nickname')
  // @ApiOperation({ summary: '파티 초대' })
  // async sendPartyInvitation(
  //   @CurrentUser() user: CurrentUserType,
  //   @Param('partyId') partyId: number,
  //   @Param('nickname') nickname: string,
  //   @Body() dto: PartyRequestDto,
  // ): Promise<void> {
  //   dto;
  // }

  // @Delete(':partyId/invitation/:nickname')
  // @ApiOperation({ summary: '파티 초대 취소' })
  // async deletePartyInvitation(
  //   @CurrentUser() user: CurrentUserType,
  //   @Param('partyId') partyId: number,
  //   @Param('nickname') nickname: string,
  //   @Body() dto: PartyRequestDto,
  // ): Promise<void> {
  //   dto;
  // }

  @Post(':partyId/delegation')
  @PartyRecruitmentSwagger.transferPartyLeadership()
  async transferPartyLeadership(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() dto: PartyDelegationRequestDto,
  ): Promise<void> {
    const command = new DelegatePartyCommand(user.id, param.partyId, dto.delegateUserId);

    return this.commandBus.execute(command);
  }
}
