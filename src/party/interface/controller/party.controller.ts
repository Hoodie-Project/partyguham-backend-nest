import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PartySwagger } from '../party.swagger';

import { GetPartyResponseDto } from '../dto/response/get-party.response.dto';
import { PartyRequestDto } from '../dto/request/party.param.request.dto';
import { CreatePartyRequestDto } from '../dto/request/create-party.request.dto';
import { PartyTypeResponseDto } from '../dto/response/partyType.response.dto';
import { GetPartyUserResponseDto } from '../dto/response/get-partyUser.response.dto';
import { PartyUserQueryRequestDto } from '../dto/request/partyUser.query.request.dto';

import { CreatePartyCommand } from '../../application/command/create-party.comand';
import { LeavePartyCommand } from '../../application/command/leave-party.comand';

import { GetPartyQuery } from '../../application/query/get-party.query';
import { GetPartyTypesQuery } from '../../application/query/get-partyTypes.query';
import { GetPartyUserQuery } from '../../application/query/get-partyUser.query';
import { GetPartyUserAuthorityQuery } from '../../application/query/get-partyUserAuthority.query';

@ApiBearerAuth('AccessJwt')
@ApiTags('party - 파티')
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
    const image = file ? file.path : null;

    const command = new CreatePartyCommand(user.id, title, content, image, partyTypeId, positionId);

    return this.commandBus.execute(command);
  }

  @PartySwagger.getParty()
  @Get(':partyId')
  async getParty(@Param() param: PartyRequestDto) {
    const party = new GetPartyQuery(param.partyId);
    const result = this.queryBus.execute(party);

    return plainToInstance(GetPartyResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get(':partyId/users')
  @PartySwagger.getPartyUsers()
  async getPartyUsers(@Param() param: PartyRequestDto, @Query() query: PartyUserQueryRequestDto) {
    const { sort, order, main, nickname } = query;

    const party = new GetPartyUserQuery(param.partyId, sort, order, main, nickname);
    const result = this.queryBus.execute(party);

    return plainToInstance(GetPartyUserResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get(':partyId/users/me/authority')
  @PartySwagger.getPartyAuthority()
  async getPartyAuthority(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto) {
    const userId = user.id;

    const party = new GetPartyUserAuthorityQuery(param.partyId, userId);
    const result = this.queryBus.execute(party);

    return result; // res ex) { "authority": "master" }
  }

  @UseGuards(AccessJwtAuthGuard)
  @HttpCode(204)
  @PartySwagger.leaveParty()
  @Delete(':partyId/users/me')
  async leaveParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new LeavePartyCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }
}
