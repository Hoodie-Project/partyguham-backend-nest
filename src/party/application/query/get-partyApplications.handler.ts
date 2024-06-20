import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

import { Repository } from 'typeorm';
import { GetPartyApplicationsQuery } from './get-partyApplications.query';
import { PartyApplicationEntity } from 'src/party/infra/db/entity/apply/party_application.entity';
import { PartyAuthority, PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';

@QueryHandler(GetPartyApplicationsQuery)
export class GetPartyApplicationsHandler implements IQueryHandler<GetPartyApplicationsQuery> {
  constructor(
    @InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>,
    @InjectRepository(PartyUserEntity) private partyUserRepository: Repository<PartyUserEntity>,
    @InjectRepository(PartyApplicationEntity) private partyApplicationRepository: Repository<PartyApplicationEntity>,
  ) {}

  async execute(query: GetPartyApplicationsQuery) {
    const { userId, partyId, partyRecruitmentId } = query;

    const partyUser = await this.partyUserRepository
      .createQueryBuilder('partyUser')
      .where('partyUser.userId = :userId', { userId })
      .andWhere('partyUser.partyId = :partyId', { partyId })
      .getOne();

    if (partyUser.authority !== PartyAuthority.MASTER) {
      throw new UnauthorizedException('파티 지원자 조회 권한이 없습니다.');
    }

    const partyApplicationUser = await this.partyApplicationRepository
      .createQueryBuilder('partyApplication')
      .leftJoinAndSelect('partyApplication.user', 'user')
      .where('partyUser.partyRecruitmentId = :partyRecruitmentId', { partyRecruitmentId })
      .getManyAndCount();

    return { count: partyApplicationUser[1], partyApplicationUser };
  }
}
