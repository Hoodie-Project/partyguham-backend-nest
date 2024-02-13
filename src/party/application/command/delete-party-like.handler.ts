import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePartyLikeCommand } from './delete-party-like.comand';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyLikeRepository } from 'src/party/domain/party/repository/iPartyLike.repository';

@Injectable()
@CommandHandler(DeletePartyLikeCommand)
export class DeletePartyLikeHandler implements ICommandHandler<DeletePartyLikeCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyLikeRepository: IPartyLikeRepository,
  ) {}

  async execute(command: DeletePartyLikeCommand) {
    const { userId, partyId } = command;

    const party = await this.partyRepository.findOne(partyId);
    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다.');
    }

    const result = await this.partyLikeRepository.delete(userId, partyId);
    if (!result) {
      throw new InternalServerErrorException('삭제되지 않았습니다.');
    }
  }
}
