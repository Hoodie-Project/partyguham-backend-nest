import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { IPartyTypeRepository } from 'src/party/domain/party/repository/iPartyType.repository';
import { CreatePartyRecruitmentCommand } from './create-partyRecruitment.comand';

@Injectable()
@CommandHandler(CreatePartyRecruitmentCommand)
export class CreatePartyRecruitmentHandler implements ICommandHandler<CreatePartyRecruitmentCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyTypeRepository') private partyTypeRepository: IPartyTypeRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: CreatePartyRecruitmentCommand) {
    const { userId, partyId, message } = command;

    // const party = await this.partyRepository.create(partyTypeId, title, content, image);

    // await this.partyUserRepository.createMaster(userId, party.getId(), positionId);

    // return party;
  }
}
