import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { PartyRecruitmentSwagger } from '../partyRecruitment.swagger';
import { PartySwagger } from '../party.swagger';

import { GetPartiesResponseDto } from '../dto/response/get-parties.response.dto';
import { PartyQueryRequestDto } from '../dto/request/party.query.request.dto';
import { RecruitmentsQueryRequestDto } from '../dto/request/recruitment/recruitment.query.request.dto';
import { GetPartyRecruitmentsResponseDto } from '../dto/response/recruitment/get-partyRecruitments.response.dto';
import { RecruitmentsPersonalizedQueryRequestDto } from '../dto/request/recruitmentPersonalized.query.request.dto';

import { GetPartiesQuery } from '../../application/query/get-parties.query';
import { GetRecruitmentsQuery } from '../../application/query/get-recruitments.query';
import { GetRecruitmentsPersonalizedQuery } from '../../application/query/get-recruitmentsPersonalized.query';
import { SearchRequestDto } from '../dto/request/search.request.dto';
import { GetSearchQuery } from '../../application/query/get-search.query';
import { GetSearchResponseDto } from '../dto/response/get-partySearch.response.dto';

@ApiTags('party landing page - 파티 렌딩 페이지 API')
@Controller('parties')
export class PartyLandingController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('search')
  @PartySwagger.getSearch()
  async getSearch(@Query() query: SearchRequestDto) {
    const { page, limit, titleSearch } = query;

    const search = new GetSearchQuery(page, limit, titleSearch);
    const result = this.queryBus.execute(search);

    return plainToInstance(GetSearchResponseDto, result);
  }

  @Get('')
  @PartySwagger.getParties()
  async getParties(@Query() query: PartyQueryRequestDto) {
    const { page, limit, sort, order, status, partyType, titleSearch } = query;

    const parties = new GetPartiesQuery(page, limit, sort, order, status, partyType, titleSearch);
    const result = this.queryBus.execute(parties);

    return plainToInstance(GetPartiesResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('recruitments/personalized')
  @PartyRecruitmentSwagger.getRecruitmentsPersonalized()
  async getRecruitmentsPersonalized(
    @CurrentUser() user: CurrentUserType,
    @Query() query: RecruitmentsPersonalizedQueryRequestDto,
  ) {
    const { page, limit, sort, order } = query;
    const userId = user.id;
    const partyRecruitment = new GetRecruitmentsPersonalizedQuery(page, limit, sort, order, userId);
    const result = this.queryBus.execute(partyRecruitment);

    return plainToInstance(GetPartyRecruitmentsResponseDto, result);
  }

  @Get('recruitments')
  @PartyRecruitmentSwagger.getRecruitments()
  async getRecruitments(@Query() query: RecruitmentsQueryRequestDto) {
    const { page, limit, sort, order, main, position, partyType, titleSearch } = query;

    const partyRecruitment = new GetRecruitmentsQuery(page, limit, sort, order, main, position, partyType, titleSearch);
    const result = this.queryBus.execute(partyRecruitment);

    return plainToInstance(GetPartyRecruitmentsResponseDto, result);
  }
}
