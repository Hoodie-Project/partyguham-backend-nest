import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { CreateGuildCommand } from '../application/command/create-guild.comand';
import { GuildUpdateCommand } from '../application/command/update-guild.comand';

import { GetGuildsQuery } from '../application/query/get-guilds.query';
import { GetGuildQuery } from '../application/query/get-guild.query';

import { GuildRequestDto } from './dto/request/guild.param.request.dto';
import { GuildCreateRequestDto } from './dto/request/guild.create.request.dto';
import { GuildUpdateRequestDto } from './dto/request/guild.update.request.dto';
import { GuildQueryRequestDto } from './dto/request/guild.query.request.dto';
import { GuildResponseDto } from './dto/response/guild.response.dto';
import { DeleteGuildCommand } from '../application/command/delete-guild.comand';

@UseGuards(AccessJwtAuthGuard)
@ApiTags('길드')
@Controller('guilds')
export class GuildController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('')
  @ApiOperation({ summary: '길드 생성' })
  async createGuild(@CurrentUser() user: CurrentUserType, @Body() dto: GuildCreateRequestDto): Promise<void> {
    const { title, content } = dto;

    const command = new CreateGuildCommand(user.id, title, content);

    return this.commandBus.execute(command);
  }

  @Get(':guildId')
  @ApiOperation({ summary: '길드 조회' })
  async getGuild(@Param() param: GuildRequestDto) {
    const guild = new GetGuildQuery(param.guildId);
    const result = this.queryBus.execute(guild);

    return plainToInstance(GuildResponseDto, result);
  }

  @Get('')
  @ApiOperation({ summary: '길드 목록 조회' })
  async getGuilds(@Query() query: GuildQueryRequestDto) {
    const { page, limit, sort, order } = query;

    const parties = new GetGuildsQuery(page, limit, sort, order);
    const result = this.queryBus.execute(parties);

    return plainToInstance(GuildResponseDto, result);
  }

  @Patch(':guildId')
  @ApiOperation({ summary: '길드 수정' })
  async updateGuild(
    @CurrentUser() user: CurrentUserType,
    @Param() param: GuildRequestDto,
    @Body() dto: GuildUpdateRequestDto,
  ): Promise<void> {
    const { title, content } = dto;

    const command = new GuildUpdateCommand(user.id, param.guildId, title, content);

    return this.commandBus.execute(command);
  }

  @HttpCode(204)
  @Delete(':guildId')
  @ApiOperation({ summary: '길드 종료 (소프트 삭제)' })
  async softDeleteGuild(@CurrentUser() user: CurrentUserType, @Param() param: GuildRequestDto): Promise<void> {
    const command = new DeleteGuildCommand(user.id, param.guildId);

    this.commandBus.execute(command);
  }

  // 신청
  @Get(':guildId/request')
  @ApiOperation({ summary: '길드 신청 조회' })
  async getGuildRequestList(
    @CurrentUser() user: CurrentUserType,
    @Param('guildId') guildId: number,
    @Body() dto,
  ): Promise<void> {
    dto;
  }

  @Post(':guildId/request')
  @ApiOperation({ summary: '길드 신청' })
  async sendGuildRequest(@CurrentUser() user: CurrentUserType, @Param('commentId') commentId: number): Promise<void> {
    commentId;
  }

  @Post(':guildId/request')
  @ApiOperation({ summary: '길드 신청 취소' })
  async deleteGuildRequest(@CurrentUser() user: CurrentUserType, @Param('commentId') commentId: number): Promise<void> {
    commentId;
  }

  // 초대
  @Get(':guildId/invite')
  @ApiOperation({ summary: '길드 초대 조회' })
  async getGuildInviteList(
    @CurrentUser() user: CurrentUserType,
    @Param('guildId') guildId: number,
    @Body() dto,
  ): Promise<void> {
    dto;
  }

  @Post(':guildId/invite/:nickname')
  @ApiOperation({ summary: '길드 초대' })
  async sendGuildInvite(
    @CurrentUser() user: CurrentUserType,
    @Param('commentId') commentId: number,
    @Param('nickname') nickname: string,
    @Body() dto: GuildRequestDto,
  ): Promise<void> {
    dto;
  }

  @Delete(':guildId/invite/:nickname')
  @ApiOperation({ summary: '길드 초대 취소' })
  async deleteGuildInvite(
    @CurrentUser() user: CurrentUserType,
    @Param('commentId') commentId: number,
    @Param('nickname') nickname: string,
    @Body() dto: GuildRequestDto,
  ): Promise<void> {
    dto;
  }

  // 권한
  @Post(':guildId/transfer')
  @ApiOperation({ summary: '파티장 위임' })
  async transferGuildLeadership(
    @CurrentUser() user: CurrentUserType,
    @Param('commentId') commentId: number,
    @Body() dto: GuildCreateRequestDto,
  ): Promise<void> {
    dto;
  }
}
