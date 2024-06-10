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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { CreatePartyCommand } from '../application/command/create-party.comand';
import { UpdatePartyCommand } from '../application/command/update-party.comand';
import { DeletePartyCommand } from '../application/command/delete-party.comand';

import { GetPartiesQuery } from '../application/query/get-parties.query';
import { GetPartyQuery } from '../application/query/get-party.query';

import { PartyRequestDto } from './dto/request/party.param.request.dto';

import { CreatePartyRequestDto } from './dto/request/create-party.request.dto';
import { UpdatePartyRequestDto } from './dto/request/update-party.request.dto';
import { PartyQueryRequestDto } from './dto/request/party.query.request.dto';
import { PartyResponseDto } from './dto/response/party.response.dto';
import { GetPartyTypesQuery } from '../application/query/get-partyTypes.query';
import { CreatePartyRecruitmentRequestDto } from './dto/request/create-partyRecruitment.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePartyApplicationRequestDto } from './dto/request/create-application.request.dto';
import { CreatePartyApplicationCommand } from '../application/command/create-partyApplication.comand';
import { CreatePartyRecruitmentCommand } from '../application/command/create-partyRecruitment.comand';
import { PartyRecruitmentParamRequestDto } from './dto/request/partyRecruitment.param.request.dto';

@ApiTags('파티')
@UseGuards(AccessJwtAuthGuard)
@Controller('parties')
export class PartyController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('types')
  @ApiOperation({ summary: '파티 타입 리스트 조회' })
  async getPartyType() {
    const party = new GetPartyTypesQuery();
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyResponseDto, result);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: '파티 생성 - form-data(image)' })
  async createParty(
    @CurrentUser() user: CurrentUserType,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePartyRequestDto,
  ): Promise<void> {
    const { title, content, partyTypeId, positionId } = dto;
    const resultPath = file.path.substring(file.path.indexOf('/uploads'));
    const command = new CreatePartyCommand(user.id, title, content, resultPath, partyTypeId, positionId);

    return this.commandBus.execute(command);
  }

  @Get(':partyId')
  @ApiOperation({ summary: '파티 페이지 조회' })
  async getParty(@Param() param: PartyRequestDto) {
    const party = new GetPartyQuery(param.partyId);
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyResponseDto, result);
  }

  @Get('')
  @ApiOperation({ summary: '파티 목록 조회' })
  async getParties(@Query() query: PartyQueryRequestDto) {
    const { page, limit, sort, order } = query;

    const parties = new GetPartiesQuery(page, limit, sort, order);
    const result = this.queryBus.execute(parties);

    return plainToInstance(PartyResponseDto, result);
  }

  @Patch(':partyId')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: '파티 수정 - form-data(이미지)' })
  async updateParty(
    @CurrentUser() user: CurrentUserType,
    @UploadedFile() file: Express.Multer.File,
    @Param() param: PartyRequestDto,
    @Body() dto: UpdatePartyRequestDto,
  ): Promise<void> {
    const { title, content } = dto;
    const resultPath = file.path.substring(file.path.indexOf('/uploads'));

    const command = new UpdatePartyCommand(user.id, param.partyId, title, content, resultPath);

    return this.commandBus.execute(command);
  }

  @HttpCode(204)
  @Delete(':partyId')
  @ApiOperation({ summary: '파티 삭제 (softdelete)' })
  async deleteParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  // 모집
  @Post(':partyId/recruitments')
  @ApiOperation({ summary: '파티 모집 생성하기' })
  async createRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Body() dto: CreatePartyRecruitmentRequestDto,
  ): Promise<void> {
    const command = new CreatePartyRecruitmentCommand(user.id, partyId, dto.recruitment);

    return this.commandBus.execute(command);
  }

  @Get(':partyId/recruitments')
  @ApiOperation({ summary: '파티 모집 조회' })
  async getPartyRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Body() dto: CreatePartyRequestDto,
  ): Promise<void> {}

  @Patch(':partyId/recruitments/:partyRecruitmentId')
  @ApiOperation({ summary: '파티 모집 수정' })
  async updateRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Param('partyRecruitmentId') partyRecruitmentId: number,
  ): Promise<void> {
    partyId;
  }

  @Delete(':partyId/recruitments/:partyRecruitmentId')
  @ApiOperation({ summary: '파티 모집 삭제' })
  async deleteRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Param('partyRecruitmentId') partyRecruitmentId: number,
  ): Promise<void> {
    partyId;
  }

  // 지원
  @Post(':partyId/recruitments/:partyRecruitmentId/application')
  @ApiOperation({ summary: '파티 지원 하기' })
  async createPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
    @Body() dto: CreatePartyApplicationRequestDto,
  ): Promise<void> {
    const command = new CreatePartyApplicationCommand(user.id, param.partyId, param.partyRecruitmentId, dto.message);

    return this.commandBus.execute(command);
  }

  // @Get(':partyId/applications')
  // @ApiOperation({ summary: '파티 지원 현황 리스트 조회' })
  // async getPartyApplication(@CurrentUser() user: CurrentUserType, @Param('partyId') partyId: number): Promise<void> {
  //   // 파티장만 조회 가능
  // }

  // @Delete(':partyId/application')
  // @ApiOperation({ summary: '파티 지원 취소' })
  // async deletePartyApplication(@CurrentUser() user: CurrentUserType, @Param('partyId') partyId: number): Promise<void> {
  //   partyId;
  // }

  // 초대
  @Post(':partyId/invitation/:nickname')
  @ApiOperation({ summary: '파티 초대' })
  async sendPartyInvitation(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Param('nickname') nickname: string,
    @Body() dto: PartyRequestDto,
  ): Promise<void> {
    dto;
  }

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

  // 권한
  @Post(':partyId/delegation')
  @ApiOperation({ summary: '파티장 위임' })
  async transferPartyLeadership(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Body() dto: CreatePartyRequestDto,
  ): Promise<void> {
    dto;
  }
}
