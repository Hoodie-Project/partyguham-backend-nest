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
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PartySwagger } from './party.swagger';

import { PartyDelegationRequestDto } from './dto/request/delegate-party.request.dto';
import { UpdatePartyUserRequestDto } from './dto/request/update-partyUser.request.dto';
import { PartyUserParamRequestDto } from './dto/request/partyUser.param.request.dto';
import { GetPartiesResponseDto } from './dto/response/get-parties.response.dto';
import { GetPartyResponseDto } from './dto/response/get-party.response.dto';
import { PartyRequestDto } from './dto/request/party.param.request.dto';
import { CreatePartyRequestDto } from './dto/request/create-party.request.dto';
import { UpdatePartyRequestDto } from './dto/request/update-party.request.dto';
import { PartyQueryRequestDto } from './dto/request/party.query.request.dto';
import { PartyTypeResponseDto } from './dto/response/partyType.response.dto';
import { PartyResponseDto } from './dto/response/party.response.dto';

import { CreatePartyCommand } from '../application/command/create-party.comand';
import { UpdatePartyCommand } from '../application/command/update-party.comand';
import { DeletePartyCommand } from '../application/command/delete-party.comand';
import { DeletePartyImageCommand } from '../application/command/delete-partyImage.comand';
import { DeletePartyUserCommand } from '../application/command/delete-partyUser.comand';
import { DelegatePartyCommand } from '../application/command/delegate-party.comand';
import { UpdatePartyUserCommand } from '../application/command/update-partyUser.comand';
import { LeavePartyCommand } from '../application/command/leave-party.comand';
import { EndPartyCommand } from '../application/command/end-party.comand';
import { ActivePartyCommand } from '../application/command/active-party.comand';

import { GetPartiesQuery } from '../application/query/get-parties.query';
import { GetPartyQuery } from '../application/query/get-party.query';
import { GetPartyTypesQuery } from '../application/query/get-partyTypes.query';
import { GetPartyUserQuery } from '../application/query/get-partyUser.query';
import { GetPartyUserResponseDto } from './dto/response/get-partyUser.response.dto';
import { PartyUserQueryRequestDto } from './dto/request/partyUser.query.request.dto';

@ApiTags('party')
@Controller('parties')
export class PartyController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @UseGuards(AccessJwtAuthGuard)
  @Get('types')
  @PartySwagger.getTypes()
  async getPartyType() {
    const party = new GetPartyTypesQuery();
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyTypeResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
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

  @Get(':partyId/users')
  @PartySwagger.getPartyUser()
  async getPartyUser(@Param() param: PartyRequestDto, @Query() query: PartyUserQueryRequestDto) {
    const { sort, order, main } = query;

    const party = new GetPartyUserQuery(param.partyId, sort, order, main);
    const result = this.queryBus.execute(party);

    return plainToInstance(GetPartyUserResponseDto, result);
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
  @HttpCode(204)
  @PartySwagger.leaveParty()
  @Delete(':partyId/party-users/me')
  async leaveParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new LeavePartyCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @PartySwagger.updatePartyUser()
  @Patch(':partyId/party-users/:partyUserId')
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
  @Delete(':partyId/party-users/:partyUserId')
  async kickUserFromParty(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyUserParamRequestDto,
  ): Promise<void> {
    const command = new DeletePartyUserCommand(user.id, param.partyId, param.partyUserId);

    this.commandBus.execute(command);
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
