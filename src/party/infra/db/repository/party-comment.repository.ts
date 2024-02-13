import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IPartyCommentRepository } from 'src/party/domain/party/repository/iPartyComment.repository';
import { PartyCommentEntity } from '../entity/party/party-comment.entity';

@Injectable()
export class PartyCommentRepository implements IPartyCommentRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyCommentEntity)
    private partyCommentRepository: Repository<PartyCommentEntity>,
  ) {}

  async create(userId: number, partyId: number, comment: string) {
    await this.partyCommentRepository.save({ userId, partyId, comment });
  }

  async update(commentId: number, userId: number, comment: string) {
    const findComment = await this.findOne(commentId, userId);

    await this.partyCommentRepository.save({ ...findComment, comment });
  }

  async delete(commentId: number, userId: number) {
    const result = await this.partyCommentRepository.delete({ userId, id: commentId });

    return result.affected ? true : false;
  }

  async findOne(commentId: number, userId: number) {
    const result = await this.partyCommentRepository.findOne({
      where: { id: commentId, userId },
    });

    if (!result) {
      throw new NotFoundException('댓글이 존재하지 않습니다');
    }

    return result;
  }
}
