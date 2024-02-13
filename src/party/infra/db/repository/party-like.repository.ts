import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IPartyLikeRepository } from 'src/party/domain/party/repository/iPartyLike.repository';
import { PartyLikeEntity } from '../entity/party/party-like.entity';

@Injectable()
export class PartyLikeRepository implements IPartyLikeRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyLikeEntity)
    private partyLikeRepository: Repository<PartyLikeEntity>,
  ) {}

  async create(userId: number, partyId: number) {
    await this.partyLikeRepository.save({ userId, partyId });
  }

  async delete(userId: number, partyId: number) {
    const result = await this.partyLikeRepository.delete({ userId, partyId });

    return result.affected ? true : false;
  }
}
