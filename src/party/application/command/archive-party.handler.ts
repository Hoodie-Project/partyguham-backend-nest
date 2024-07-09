import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { ArchivePartyCommand } from './archive-party.comand';

@Injectable()
@CommandHandler(ArchivePartyCommand)
export class ArchivePartyHandler implements ICommandHandler<ArchivePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: ArchivePartyCommand) {
    const { userId, partyId } = command;
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority !== 'master') {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.partyRepository.deletedById(partyId);
  }
}
