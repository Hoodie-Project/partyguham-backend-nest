import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';
import { GetRecruitmentsPersonalizedQuery } from './get-recruitmentsPersonalized.query';
import { UserService } from 'src/user/application/user.service';

@QueryHandler(GetRecruitmentsPersonalizedQuery)
export class GetRecruitmentsPersonalizedHandler implements IQueryHandler<GetRecruitmentsPersonalizedQuery> {
  constructor(
    @InjectRepository(PartyRecruitmentEntity) private partyrecruitmentRepository: Repository<PartyRecruitmentEntity>,
    readonly userService: UserService,
  ) {}

  async execute(query: GetRecruitmentsPersonalizedQuery) {
    const { page, limit, sort, order, userId } = query;
    const userCarerr = await this.userService.findByUserIdAndPrimary(userId);

    if (!userCarerr) {
      throw new NotFoundException('주포지션을 입력하지 않았습니다.', 'USER_CARRER_NOT_EXIST');
    }
    const userPrimaryPosition = userCarerr.positionId;

    const offset = (page - 1) * limit || 0;

    const recruitmentsQuery = this.partyrecruitmentRepository
      .createQueryBuilder('partyRecruitments')
      .leftJoin('partyRecruitments.party', 'party')
      .leftJoin('partyRecruitments.position', 'position')
      .select(['partyRecruitments', 'party.title', 'party.image', 'position'])
      .limit(limit)
      .offset(offset)
      .where('partyRecruitments.positionId = :positionId', { positionId: userPrimaryPosition })
      .orderBy(`partyRecruitments.${sort}`, order);

    const [partyRecruitments, total] = await recruitmentsQuery.getManyAndCount();

    if (!partyRecruitments) {
      throw new NotFoundException('파티모집이 존재하지 않습니다', 'PARTY_RECRUITMENT_NOT_EXIST');
    }

    return { total, partyRecruitments };
  }
}
