import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentAccount } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { DecodedPayload } from 'src/auth/jwt.payload';

import { CreatePartyCommand } from '../application/command/create-party.comand';
import { UpdatePartyCommand } from '../application/command/update-party.comand';
import { DeletePartyCommand } from '../application/command/delete-party.comand';

import { GetPartiesQuery } from '../application/query/get-parties.query';
import { GetPartyQuery } from '../application/query/get-party.query';

import { PartyRequestDto } from './dto/request/party.param.request.dto';
import { PartyCommentRequestDto } from './dto/request/party-comment.request.dto';
import { CreatePartyRequestDto } from './dto/request/create-party.request.dto';
import { UpdatePartyRequestDto } from './dto/request/update-party.request.dto';
import { PartyQueryRequestDto } from './dto/request/party.query.request.dto';
import { PartyResponseDto } from './dto/response/party.response.dto';
import { GetPartyLikeQuery } from '../application/query/get-party-like.query';
import { CreatePartyLikeCommand } from '../application/command/create-party-like.comand';
import { DeletePartyLikeCommand } from '../application/command/delete-party-like.comand';
import { CreateCommentCommand } from '../application/command/create-comment.comand';
import { CommentRequestDto } from './dto/request/comment.param.request.dto';
import { UpdateCommentCommand } from '../application/command/update-comment.comand';
import { DeleteCommentCommand } from '../application/command/delete-comment.comand';

@UseGuards(AccessJwtAuthGuard)
@Controller('parties')
@ApiTags('parties')
export class PartyController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':partyId')
  @ApiOperation({ summary: '파티(게시물) 조회' })
  async getParty(@Param() param: PartyRequestDto) {
    const party = new GetPartyQuery(param.partyId);
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyResponseDto, result);
  }

  @Get('')
  @ApiOperation({ summary: '파티(게시물) 목록 조회' })
  async getParties(@Query() query: PartyQueryRequestDto) {
    const { page, limit, sort, order } = query;

    const parties = new GetPartiesQuery(page, limit, sort, order);
    const result = this.queryBus.execute(parties);

    return plainToInstance(PartyResponseDto, result);
  }

  @Post('')
  @ApiOperation({ summary: '파티(게시물) 생성' })
  async createParty(@CurrentAccount() payload: DecodedPayload, @Body() dto: CreatePartyRequestDto): Promise<void> {
    const { title, content, positionId } = dto;

    const command = new CreatePartyCommand(payload.id, title, content, positionId);

    return this.commandBus.execute(command);
  }

  @Put(':partyId')
  @ApiOperation({ summary: '파티(게시물) 수정' })
  async updateParty(
    @CurrentAccount() payload: DecodedPayload,
    @Param() param: PartyRequestDto,
    @Body() dto: UpdatePartyRequestDto,
  ): Promise<void> {
    const { title, content } = dto;

    const command = new UpdatePartyCommand(payload.id, param.partyId, title, content);

    return this.commandBus.execute(command);
  }

  @HttpCode(204)
  @Delete(':partyId')
  @ApiOperation({ summary: '파티(게시물) 종료 (소프트 삭제)' })
  async deleteParty(@CurrentAccount() payload: DecodedPayload, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyCommand(payload.id, param.partyId);

    this.commandBus.execute(command);
  }

  // 좋아요
  @Get(':partyId')
  @ApiOperation({ summary: '파티(게시물) 좋아요 목록 조회' })
  async getlikes(@CurrentAccount() payload: DecodedPayload, @Query() query: PartyQueryRequestDto): Promise<void> {
    const { page, limit, sort, order } = query;

    const party = new GetPartyLikeQuery(payload.id, page, limit, sort, order);

    this.queryBus.execute(party);
  }

  @HttpCode(204)
  @Post('like/:partyId')
  @ApiOperation({ summary: '파티(게시물) 좋아요' })
  async createPartyToLike(@CurrentAccount() payload: DecodedPayload, @Param() param: PartyRequestDto): Promise<void> {
    const command = new CreatePartyLikeCommand(payload.id, param.partyId);

    this.commandBus.execute(command);
  }

  @HttpCode(204)
  @Delete('like/:partyId')
  @ApiOperation({ summary: '파티(게시물) 좋아요 취소' })
  async deletePartyToLike(@CurrentAccount() payload: DecodedPayload, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyLikeCommand(payload.id, param.partyId);

    this.commandBus.execute(command);
  }

  // 댓글
  @Post(':partyId/comments')
  @ApiOperation({ summary: '파티(게시물) 댓글 생성' })
  async createPartyComment(
    @CurrentAccount() payload: DecodedPayload,
    @Param() param: PartyRequestDto,
    @Body() dto: PartyCommentRequestDto,
  ): Promise<void> {
    const { comment } = dto;

    const command = new CreateCommentCommand(payload.id, param.partyId, comment);

    return this.commandBus.execute(command);
  }

  @Put('comments/:commentId')
  @ApiOperation({ summary: '파티(게시물) 댓글 수정' })
  async updatePartyComment(
    @CurrentAccount() payload: DecodedPayload,
    @Param() param: CommentRequestDto,
    @Body() dto: PartyCommentRequestDto,
  ): Promise<void> {
    const { comment } = dto;

    const command = new UpdateCommentCommand(param.commentId, payload.id, comment);

    return this.commandBus.execute(command);
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: '파티(게시물) 댓글 삭제' })
  async deletePartyComment(
    @CurrentAccount() payload: DecodedPayload,
    @Param() param: CommentRequestDto,
  ): Promise<void> {
    const command = new DeleteCommentCommand(param.commentId, payload.id);

    return this.commandBus.execute(command);
  }

  // 신청
  @Get(':partyId/request')
  @ApiOperation({ summary: '파티 신청 조회' })
  async getPartyRequestList(
    @CurrentAccount() payload: DecodedPayload,
    @Param('partyId') partyId: number,
    @Body() dto: PartyCommentRequestDto,
  ): Promise<void> {
    dto;
  }

  @Post(':partyId/request')
  @ApiOperation({ summary: '파티 신청' })
  async sendPartyRequest(
    @CurrentAccount() payload: DecodedPayload,
    @Param('commentId') commentId: number,
  ): Promise<void> {
    commentId;
  }

  @Post(':partyId/request')
  @ApiOperation({ summary: '파티 신청 취소' })
  async deletePartyRequest(
    @CurrentAccount() payload: DecodedPayload,
    @Param('commentId') commentId: number,
  ): Promise<void> {
    commentId;
  }

  // 초대
  @Get(':partyId/invite')
  @ApiOperation({ summary: '파티 초대 조회' })
  async getPartyInviteList(
    @CurrentAccount() payload: DecodedPayload,
    @Param('partyId') partyId: number,
    @Body() dto: PartyCommentRequestDto,
  ): Promise<void> {
    dto;
  }

  @Post(':partyId/invite/:nickname')
  @ApiOperation({ summary: '파티 초대' })
  async sendPartyInvite(
    @CurrentAccount() payload: DecodedPayload,
    @Param('commentId') commentId: number,
    @Param('nickname') nickname: string,
    @Body() dto: PartyRequestDto,
  ): Promise<void> {
    dto;
  }

  @Delete(':partyId/invite/:nickname')
  @ApiOperation({ summary: '파티 초대 취소' })
  async deletePartyInvite(
    @CurrentAccount() payload: DecodedPayload,
    @Param('commentId') commentId: number,
    @Param('nickname') nickname: string,
    @Body() dto: PartyRequestDto,
  ): Promise<void> {
    dto;
  }

  // 권한
  @Post(':partyId/transfer')
  @ApiOperation({ summary: '파티장 위임' })
  async transferPartyLeadership(
    @CurrentAccount() payload: DecodedPayload,
    @Param('commentId') commentId: number,
    @Body() dto: CreatePartyRequestDto,
  ): Promise<void> {
    dto;
  }
}
