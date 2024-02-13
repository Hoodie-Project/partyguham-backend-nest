import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePartyLikeCommand } from './create-party-like.comand';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyLikeRepository } from 'src/party/domain/party/repository/iPartyLike.repository';

@Injectable()
@CommandHandler(CreatePartyLikeCommand)
export class CreatePartyLikeHandler implements ICommandHandler<CreatePartyLikeCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyLikeRepository: IPartyLikeRepository,
  ) {}

  async execute(command: CreatePartyLikeCommand) {
    const { userId, partyId } = command;

    const party = await this.partyRepository.findOne(partyId);
    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다.');
    }

    await this.partyLikeRepository.create(userId, partyId);

    return party;
  }
}
