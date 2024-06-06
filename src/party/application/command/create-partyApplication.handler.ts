import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { IPartyTypeRepository } from 'src/party/domain/party/repository/iPartyType.repository';
import { CreatePartyApplicationCommand } from './create-partyApplication.comand';

@Injectable()
@CommandHandler(CreatePartyApplicationCommand)
export class CreatePartyApplicationHandler implements ICommandHandler<CreatePartyApplicationCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyTypeRepository') private partyTypeRepository: IPartyTypeRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: CreatePartyApplicationCommand) {
    const { userId, partyId, message } = command;

    // const party = await this.partyRepository.create(partyTypeId, title, content, image);

    // await this.partyUserRepository.createMaster(userId, party.getId(), positionId);

    // return party;
  }
}
