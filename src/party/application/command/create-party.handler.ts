import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePartyCommand } from './create-party.comand';
import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

@Injectable()
@CommandHandler(CreatePartyCommand)
export class CreatePartyHandler implements ICommandHandler<CreatePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: CreatePartyCommand) {
    const { userId, title, content, positionId } = command;

    const party = await this.partyRepository.create(title, content);

    await this.partyUserRepository.createMaster(userId, party.getId(), positionId);

    return party;
  }
}
