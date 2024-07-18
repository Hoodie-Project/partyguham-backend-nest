import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePartyCommand } from './create-party.comand';
import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { IPartyTypeRepository } from 'src/party/domain/party/repository/iPartyType.repository';

@Injectable()
@CommandHandler(CreatePartyCommand)
export class CreatePartyHandler implements ICommandHandler<CreatePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyTypeRepository') private partyTypeRepository: IPartyTypeRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: CreatePartyCommand) {
    const { userId, title, content, image, partyTypeId, positionId } = command;
    const partyType = await this.partyTypeRepository.findOne(partyTypeId);
    if (!partyType) {
      throw new NotFoundException('NOT_FOUND', 'Party Type이 존재하지 않습니다.');
    }

    const party = await this.partyRepository.create(partyTypeId, title, content, image);

    await this.partyUserRepository.createMaster(userId, party.id, positionId);

    return party;
  }
}
