import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { DeletePartyUserCommand } from './delete-partyUser.comand';

@Injectable()
@CommandHandler(DeletePartyUserCommand)
export class DeletePartyUserHandler implements ICommandHandler<DeletePartyUserCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: DeletePartyUserCommand) {
    const { userId, partyId, partyUserId } = command;
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority !== 'master') {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    const deletedPartyUser = await this.partyUserRepository.findOneById(partyUserId);

    if (!deletedPartyUser) {
      throw new NotFoundException('{party_user}_NOT_EXIST');
    }

    if (deletedPartyUser.authority !== 'member') {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    await this.partyUserRepository.deleteById(partyId);
  }
}
