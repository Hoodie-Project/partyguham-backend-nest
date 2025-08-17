import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetPartyApplicationsQuery } from './get-partyApplications.query';
import { PartyApplicationEntity } from 'src/party/infra/db/entity/apply/party_application.entity';
import { PartyAuthority, PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';
import { StatusEnum } from 'src/common/entity/baseEntity';

@QueryHandler(GetPartyApplicationsQuery)
export class GetPartyApplicationsHandler implements IQueryHandler<GetPartyApplicationsQuery> {
  constructor(
    @InjectRepository(PartyUserEntity) private partyUserRepository: Repository<PartyUserEntity>,
    @InjectRepository(PartyApplicationEntity) private partyApplicationRepository: Repository<PartyApplicationEntity>,
  ) {}

  async execute(query: GetPartyApplicationsQuery) {
    const { userId, partyId, partyRecruitmentId, page, limit, sort, order, status } = query;

    const partyUser = await this.partyUserRepository
      .createQueryBuilder('partyUser')
      .where('partyUser.userId = :userId', { userId })
      .andWhere('partyUser.partyId = :partyId', { partyId })
      .andWhere('partyUser.status != :deleted', { deleted: StatusEnum.DELETED })
      .getOne();

    if (!partyUser) {
      throw new NotFoundException('파티에 속한 유저를 찾을 수 없습니다.', 'PARTY_USER_NOT_EXIST');
    }

    if (partyUser.authority !== PartyAuthority.MASTER) {
      throw new ForbiddenException('파티 지원자 조회 권한이 없습니다.', 'ACCESS_DENIED');
    }

    // partyId, partyRecruitmentId (부모자식 관계인지 확인 필요)

    const offset = (page - 1) * limit || 0;
    const partyApplicationUserQuery = this.partyApplicationRepository
      .createQueryBuilder('partyApplication')
      .leftJoin('partyApplication.user', 'user')
      .select([
        'partyApplication.id',
        'partyApplication.message',
        'partyApplication.status',
        'partyApplication.createdAt',
        'user.id',
        'user.nickname',
        'user.image',
      ])
      .where('partyApplication.partyRecruitmentId = :partyRecruitmentId', { partyRecruitmentId })
      .limit(limit)
      .offset(offset)
      .orderBy(`partyApplication.${sort}`, order);

    if (status !== undefined && status !== null) {
      partyApplicationUserQuery.andWhere('partyApplication.status = :status', { status });
    }

    const [partyApplicationUser, total] = await partyApplicationUserQuery.getManyAndCount();

    return { total, partyApplicationUser };
  }
}
