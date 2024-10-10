import { Controller, Get, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { PartySwagger } from './party.swagger';

import { GetPartiesResponseDto } from './dto/response/get-parties.response.dto';

import { PartyQueryRequestDto } from './dto/request/party.query.request.dto';

import { GetPartiesQuery } from '../application/query/get-parties.query';

import { PartyRecruitmentSwagger } from './partyRecruitment.swagger';
import { RecruitmentsQueryRequestDto } from './dto/request/recruitment.query.request.dto';
import { GetRecruitmentsQuery } from '../application/query/get-recruitments.query';
import { GetPartyRecruitmentsResponseDto } from './dto/response/get-recruitments.response.dto';

@ApiTags('party landing page (렌딩 페이지 파티 API)')
@Controller('parties')
export class PartyLandingController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('')
  @PartySwagger.getParties()
  async getParties(@Query() query: PartyQueryRequestDto) {
    const { page, limit, sort, order, status, partyType, titleSearch } = query;

    const parties = new GetPartiesQuery(page, limit, sort, order, status, partyType, titleSearch);
    const result = this.queryBus.execute(parties);

    return plainToInstance(GetPartiesResponseDto, result);
  }

  @Get('recruitments')
  @PartyRecruitmentSwagger.getRecruitments()
  async getRecruitments(@Query() query: RecruitmentsQueryRequestDto) {
    const { page, limit, sort, order, main, positionIds, titleSearch } = query;

    const positionIdArray = positionIds ? positionIds.split(',').map(Number) : null;

    const party = new GetRecruitmentsQuery(page, limit, sort, order, main, positionIdArray, titleSearch);
    const result = this.queryBus.execute(party);

    return plainToInstance(GetPartyRecruitmentsResponseDto, result);
  }
}
