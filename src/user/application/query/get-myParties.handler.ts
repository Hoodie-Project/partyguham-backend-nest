import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';
import { GetMyPartiesQuery } from './get-myParties.query';

@QueryHandler(GetMyPartiesQuery)
export class GetMyPartiesHandler implements IQueryHandler<GetMyPartiesQuery> {
  constructor(@InjectRepository(PartyUserEntity) private partyuserRepository: Repository<PartyUserEntity>) {}

  async execute(query: GetMyPartiesQuery) {
    const { userId, page, limit, sort, order, status } = query;

    //내가 속한 파티
    const offset = (page - 1) * limit || 0;
    const partiesQuery = this.partyuserRepository
      .createQueryBuilder('partyUser')
      .leftJoin('partyUser.position', 'partyUserPosition')
      .leftJoin('partyUser.party', 'party')
      .leftJoin('party.partyType', 'partyType')
      .select([
        'partyUser.id',
        'partyUserPosition.main',
        'partyUserPosition.sub',
        'partyUser.createdAt',
        'party.id',
        'party.title',
        'party.image',
        'party.status',
        'partyType.type',
      ])
      .where('partyUser.userId = :userId', { userId })
      .limit(limit)
      .offset(offset)
      .orderBy(`partyUser.${sort}`, order);

    if (status !== undefined && status !== null) {
      partiesQuery.andWhere('party.status = :status', { status });
    }

    const [partyUsers, total] = await partiesQuery.getManyAndCount();

    return {
      total,
      partyUsers,
    };
  }
}
