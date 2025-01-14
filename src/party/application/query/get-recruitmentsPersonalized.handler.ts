import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';
import { GetRecruitmentsPersonalizedQuery } from './get-recruitmentsPersonalized.query';
import { UserService } from 'src/user/application/user.service';
import { StatusEnum } from 'src/common/entity/baseEntity';

@QueryHandler(GetRecruitmentsPersonalizedQuery)
export class GetRecruitmentsPersonalizedHandler implements IQueryHandler<GetRecruitmentsPersonalizedQuery> {
  constructor(
    @InjectRepository(PartyRecruitmentEntity) private partyrecruitmentRepository: Repository<PartyRecruitmentEntity>,
    readonly userService: UserService,
  ) {}

  async execute(query: GetRecruitmentsPersonalizedQuery) {
    const { page, limit, sort, order, userId } = query;
    const userCarerr = await this.userService.findUserCarerrPrimaryByUserId(userId);

    const userLocation = await this.userService.findUserLocationByUserId(userId);

    const userPersonality = await this.userService.findUserPersonalityByUserId(userId);

    // 비동기 개선 필요
    if (!userCarerr || userLocation.length === 0 || userPersonality.length === 0) {
      throw new NotFoundException('세부 프로필을 입력하지 않았습니다.', 'USER_PROFILE_NOT_EXIST');
    }

    const userPrimaryPosition = userCarerr.positionId;
    const offset = (page - 1) * limit || 0;

    const recruitmentsQuery = this.partyrecruitmentRepository
      .createQueryBuilder('partyRecruitments')
      .leftJoin('partyRecruitments.party', 'party')
      .leftJoin('party.partyType', 'partyType')
      .leftJoin('partyRecruitments.position', 'position')
      .select(['partyRecruitments', 'party.id', 'party.title', 'party.image', 'partyType', 'position'])
      .limit(limit)
      .offset(offset)
      .where('partyRecruitments.positionId = :positionId', { positionId: userPrimaryPosition })
      .andWhere('partyRecruitments.status = :status', { status: StatusEnum.ACTIVE })
      .orderBy(`partyRecruitments.${sort}`, order);

    const [partyRecruitments, total] = await recruitmentsQuery.getManyAndCount();

    if (!partyRecruitments) {
      throw new NotFoundException('파티모집이 존재하지 않습니다', 'PARTY_RECRUITMENT_NOT_EXIST');
    }

    return { total, partyRecruitments };
  }
}
