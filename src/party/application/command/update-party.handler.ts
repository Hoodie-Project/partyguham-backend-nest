import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { UpdatePartyCommand } from './update-party.comand';

@Injectable()
@CommandHandler(UpdatePartyCommand)
export class UpdatePartyHandler implements ICommandHandler<UpdatePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: UpdatePartyCommand) {
    const { userId, partyId, title, content } = command;
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (!partyUser.permission) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    const party = await this.partyRepository.update(partyId, title, content);

    return party;
  }
}
