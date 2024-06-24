import {
  BadRequestException,
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
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

import { GetPartyTypesQuery } from '../application/query/get-partyTypes.query';
import { CreatePartyRecruitmentRequestDto } from './dto/request/create-partyRecruitment.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePartyApplicationRequestDto } from './dto/request/create-application.request.dto';
import { CreatePartyApplicationCommand } from '../application/command/create-partyApplication.comand';
import { CreatePartyRecruitmentCommand } from '../application/command/create-partyRecruitment.comand';
import { PartyRecruitmentParamRequestDto } from './dto/request/partyRecruitment.param.request.dto';
import { PartyTypeResponseDto } from './dto/response/partyType.response.dto';
import { PartyResponseDto } from './dto/response/party.response.dto';
import { DeletePartyImageCommand } from '../application/command/delete-partyImage.comand';
import { GetPartyRecruitmentQuery } from '../application/query/get-partyRecruitment.query';
import { RecruitmentDto } from './dto/recruitmentDto';
import { UpdatePartyRecruitmentCommand } from '../application/command/update-partyRecruitment.comand';
import { DeletePartyRecruitmentCommand } from '../application/command/delete-partyRecruitment.comand';
import { GetPartyApplicationsQuery } from '../application/query/get-partyApplications.query';
import { PartyApplicationParamRequestDto } from './dto/request/partyApplication.param.request.dto';
import { ApprovePartyApplicationCommand } from '../application/command/approve-partyApplication.comand';
import { RejectionPartyApplicationCommand } from '../application/command/rejection-partyApplication.comand';
import { PartyApis } from '../party.swagger';
import { GetPartiesResponseDto } from './dto/response/get-parties.response.dto';
import { GetPartyResponseDto } from './dto/response/get-party.response.dto';

@ApiTags('파티')
@UseGuards(AccessJwtAuthGuard)
@Controller('parties')
export class PartyController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('types')
  @PartyApis.getTypes()
  async getPartyType() {
    const party = new GetPartyTypesQuery();
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyTypeResponseDto, result);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  @PartyApis.createParty()
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
  @PartyApis.getParties()
  async getParties(@Query() query: PartyQueryRequestDto) {
    const { page, limit, sort, order } = query;

    const parties = new GetPartiesQuery(page, limit, sort, order);
    const result = this.queryBus.execute(parties);

    return plainToInstance(GetPartiesResponseDto, result);
  }

  @Get(':partyId')
  @PartyApis.getParty()
  async getParty(@Param() param: PartyRequestDto) {
    const party = new GetPartyQuery(param.partyId);
    const result = this.queryBus.execute(party);

    return plainToInstance(GetPartyResponseDto, result);
  }

  @Patch(':partyId')
  @UseInterceptors(FileInterceptor('image'))
  @PartyApis.updateParty()
  async updateParty(
    @CurrentUser() user: CurrentUserType,
    @UploadedFile() file: Express.Multer.File,
    @Param() param: PartyRequestDto,
    @Body() dto: UpdatePartyRequestDto,
  ) {
    if (Object.keys(dto).length === 0 && !file) {
      throw new BadRequestException('변경하려는 이미지 또는 정보가 없습니다.');
    }
    const { title, content } = dto;
    const imageFilePath = file ? file.path : undefined;

    const command = new UpdatePartyCommand(user.id, param.partyId, title, content, imageFilePath);

    const result = this.commandBus.execute(command);

    return plainToInstance(PartyResponseDto, result);
  }

  @HttpCode(204)
  @PartyApis.deleteParty()
  @Delete(':partyId')
  async deleteParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @Delete(':partyId/image')
  @PartyApis.deletePartyImage()
  async deletePartyImage(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyImageCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  // 모집
  @Post(':partyId/recruitments')
  @ApiOperation({ summary: '파티 모집 생성하기' })
  async createRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() dto: CreatePartyRecruitmentRequestDto,
  ): Promise<void> {
    const command = new CreatePartyRecruitmentCommand(user.id, param.partyId, dto.recruitment);

    return this.commandBus.execute(command);
  }

  @Get(':partyId/recruitments')
  @ApiOperation({ summary: '파티 모집 조회' })
  @ApiResponse({
    status: 200,
    description: '파티 모집',
    schema: {
      example: [
        {
          id: 27,
          partyId: 78,
          positionId: 1,
          recruiting_count: 1,
          recruited_count: 0,
          position: {
            id: 1,
            main: '기획',
            sub: 'UI/UX 기획자',
          },
        },
        {
          id: 28,
          partyId: 78,
          positionId: 9,
          recruiting_count: 1,
          recruited_count: 0,
          position: {
            id: 9,
            main: '디자인',
            sub: '웹 디자이너',
          },
        },
      ],
    },
  })
  async getPartyRecruitment(@Param() param: PartyRequestDto) {
    const party = new GetPartyRecruitmentQuery(param.partyId);
    const result = this.queryBus.execute(party);

    return result;
  }

  @Patch(':partyId/recruitments/:partyRecruitmentId')
  @ApiOperation({ summary: '파티 모집 수정' })
  @ApiResponse({
    status: 200,
    description: '모집 수정',
  })
  async updateRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
    @Body() body: RecruitmentDto,
  ): Promise<void> {
    const { positionId, recruiting_count } = body;

    const command = new UpdatePartyRecruitmentCommand(
      user.id,
      param.partyId,
      param.partyRecruitmentId,
      positionId,
      recruiting_count,
    );

    return this.commandBus.execute(command);
  }

  @Delete(':partyId/recruitments/:partyRecruitmentId')
  @ApiOperation({ summary: '파티 모집 삭제' })
  @ApiResponse({
    status: 204,
    description: '모집 삭제',
  })
  async deleteRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
  ): Promise<void> {
    const command = new DeletePartyRecruitmentCommand(user.id, param.partyId, param.partyRecruitmentId);

    return this.commandBus.execute(command);
  }

  // 지원
  @Post(':partyId/recruitments/:partyRecruitmentId/applications')
  @ApiOperation({ summary: '파티 지원 하기' })
  @ApiResponse({
    status: 201,
    description: '파티 지원 완료',
  })
  async createPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
    @Body() dto: CreatePartyApplicationRequestDto,
  ): Promise<void> {
    // 지원 했을 때, 중복지원 막아야함
    const command = new CreatePartyApplicationCommand(user.id, param.partyId, param.partyRecruitmentId, dto.message);

    return this.commandBus.execute(command);
  }

  @Get(':partyId/recruitments/:partyRecruitmentId/applications')
  @ApiOperation({ summary: '파티 포지션 모집별, 지원자 조회' })
  @ApiResponse({
    status: 200,
    description: '파티 지원자 조회',
  })
  @ApiResponse({
    status: 401,
    description: '파티 지원자 조회 권한이 없습니다.',
  })
  async getPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentParamRequestDto,
  ): Promise<void> {
    // 파티장만 조회 가능
    const query = new GetPartyApplicationsQuery(user.id, param.partyId, param.partyRecruitmentId);

    return this.queryBus.execute(query);
  }

  @Post(':partyId/applications/:partyApplicationId/approval')
  @ApiOperation({ summary: '파티 지원자 승인' })
  @ApiResponse({
    status: 200,
    description: '파티 지원자 승인 완료 \t\n 모집이 완료되어 해당 포지션 모집이 삭제 되었습니다.',
  })
  @ApiResponse({
    status: 403,
    description: '파티 모집 권한이 없습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '승인하려는 지원데이터가 없습니다. \t\n 요청한 파티가 유효하지 않습니다.',
  })
  async approvePartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyApplicationParamRequestDto,
  ): Promise<void> {
    const command = new ApprovePartyApplicationCommand(user.id, param.partyId, param.partyApplicationId);

    return this.commandBus.execute(command);
  }

  @Post(':partyId/applications/:partyApplicationId/rejection')
  @ApiOperation({ summary: '파티 지원자 거절' })
  @ApiResponse({
    status: 200,
    description: '파티 지원자 거절 완료',
  })
  @ApiResponse({
    status: 403,
    description: '파티 자원자에 대한 거절 권한이 없습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '거절 하려는 파티 지원자 데이터가 없습니다. \t\n 요청한 파티가 유효하지 않습니다.',
  })
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
