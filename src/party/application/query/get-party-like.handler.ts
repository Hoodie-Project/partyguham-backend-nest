import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPartiesQuery } from './get-parties.query';

import { PartyLikeEntity } from 'src/party/infra/db/entity/party/party-like.entity';
import { GetPartyLikeQuery } from './get-party-like.query';

@QueryHandler(GetPartiesQuery)
export class GetPartiessHandler implements IQueryHandler<GetPartiesQuery> {
  constructor(@InjectRepository(PartyLikeEntity) private partyLikeRepository: Repository<PartyLikeEntity>) {}

  async execute(query: GetPartyLikeQuery) {
    const { page, limit, sort, order, userId } = query;

    const offset = (page - 1) * limit || 0;
    const parties = await this.partyLikeRepository
      .createQueryBuilder('partyLike')
      .leftJoinAndSelect('partyLike.party', 'party')
      .limit(limit)
      .offset(offset)
      .orderBy(`partyLike.${sort}`, order)
      .where('partyLike.userId = :userId', { userId })
      .getManyAndCount();

    return parties;
  }
}
