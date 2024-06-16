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
import { GetPartiesResponseDto, GetPartyResponseDto } from './dto/response/get-party.response.dto';
import { GetPartyTypesQuery } from '../application/query/get-partyTypes.query';
import { CreatePartyRecruitmentRequestDto } from './dto/request/create-partyRecruitment.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePartyApplicationRequestDto } from './dto/request/create-application.request.dto';
import { CreatePartyApplicationCommand } from '../application/command/create-partyApplication.comand';
import { CreatePartyRecruitmentCommand } from '../application/command/create-partyRecruitment.comand';
import { PartyRecruitmentParamRequestDto } from './dto/request/partyRecruitment.param.request.dto';
import { PartyTypesResponseDto } from './dto/response/partyType.response.dto';
import { PartyResponseDto } from './dto/response/party.response.dto';
import { DeletePartyImageCommand } from '../application/command/delete-partyImage.comand';
import { GetPartyRecruitmentQuery } from '../application/query/get-partyRecruitment.query';
import { RecruitmentDto } from './dto/recruitmentDto';
import { UpdatePartyRecruitmentCommand } from '../application/command/update-partyRecruitment.comand';
import { DeletePartyRecruitmentCommand } from '../application/command/delete-partyRecruitment.comand';

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
  @ApiResponse({
    status: 200,
    description: '파티 목록(리스트) 조회',
    type: PartyTypesResponseDto,
  })
  async getPartyType() {
    const party = new GetPartyTypesQuery();
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyTypesResponseDto, result);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: '파티 생성 - form-data(image)' })
  @ApiResponse({
    status: 201,
    description: '파티 생성',
    type: PartyResponseDto,
  })
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
  @ApiOperation({ summary: '파티 목록(리스트) 조회' })
  @ApiResponse({
    status: 200,
    description: '파티 목록(리스트) 조회',
    type: GetPartiesResponseDto,
  })
  async getParties(@Query() query: PartyQueryRequestDto) {
    const { page, limit, sort, order } = query;

    const parties = new GetPartiesQuery(page, limit, sort, order);
    const result = this.queryBus.execute(parties);

    return plainToInstance(GetPartiesResponseDto, result);
  }

  @Get(':partyId')
  @ApiOperation({ summary: '파티 페이지 조회' })
  @ApiResponse({
    status: 200,
    description: '파티 목록(리스트) 조회',
    type: GetPartyResponseDto,
  })
  async getParty(@Param() param: PartyRequestDto) {
    const party = new GetPartyQuery(param.partyId);
    const result = this.queryBus.execute(party);

    return plainToInstance(GetPartyResponseDto, result);
  }

  @Patch(':partyId')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: '파티 수정 - form-data(이미지)' })
  @ApiResponse({
    status: 200,
    description: '파티 수정 완료',
    type: PartyResponseDto,
  })
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
  @Delete(':partyId')
  @ApiOperation({ summary: '파티 삭제 (softdelete)' })
  async deleteParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @Delete(':partyId/image')
  @ApiOperation({ summary: '파티 이미지 삭제' })
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
